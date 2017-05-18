//IOT sensors from raspberry pi
var gpio = require('onoff').Gpio,
    camera = require('./camera')(),
    led1 = new gpio(26, 'out'),
    led2 = new gpio(12, 'out'),
    led3 = new gpio(24, 'out'),
    led4 = new gpio(16, 'out'),
    motion = new gpio(21, 'in', 'both'),
    buzzer = new gpio(18, 'out');

var ledState = 0
	, smsControl = 0
	, count = 0
	, liveState = 0
	, motionWatch = 0
	, imageData = [];

// Twilio, the SMS system servicegit
var accountSid = 'AC70731db98f0a7ad0863697704e8e4716';
var authToken = '281c19c81e4762364b53524f5bf7eadc';
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

//ip address
process.env.NODE_URL='hana.local';

require('mahrio').runServer( process.env, __dirname ).then( function( server ) {

  //Serve Static Files
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: ['../public/']
      }
    }
  });

  //In-Memory Data Structure
  server.route({
	  method: 'GET',
	  path: '/photos',
	  handler: function(req, rep){
		  rep({images: imageData});
	  }
  });
  server.route({
	  method: 'POST',
	  path: '/photos/:id',
	  handler: function(req, rep){
		if( req.params.id ) {
			for( var i = 0; i < imageData.length; i++){
				if( imageData[i].id == req.params.id ) {
					imageData[i].name = req.payload.name;
					imageData[i].notes = req.payload.notes;
					imageData[i].unread = 0;
					return rep({updated: true});
				}
			}
		}
		rep({updated: false});
	  }
  });
  server.route({
	  method: 'DELETE',
	  path: '/photos/:id',
	  handler: function(req, rep){
		if( req.params.id ) {
			for( var i = 0; i < imageData.length; i++){
				if( imageData[i].id == req.params.id ) {
					imageData.splice(i, 1);
					return rep({deleted: true});
				}
			}
		}
		rep({deleted: false});
	  }
  });
  
  //Motion
	motion.watch( function(err, val) {
		if( val ) {
			console.log('Motion On');
			if( !liveState && motionWatch ) {
				camera.setMode('photo', function( imgUrl ){
				  console.log('taking photo');
				  imageData.push({url: imgUrl, id: count++, unread: 1});
				  camera.start(); 
				});
				motionWatch = 0;
				if( io ) { io.sockets.emit('event:motion:off'); }
				if( smsControl ) {
					client.messages.create({
						body: 'Peeper Feeder detects some motions, check it out on Peeper App ',
						to: '+14159990504',  // Text this number
						from: '+14159694541' // From a valid Twilio number
					}).then(function(message){
						console.log('SMS Sent: ', message.sid);
						smsControl = 0;
						if( io ) { io.sockets.emit('event:sms:off'); }
					}, function(err){ 
						console.log('SMS ERROR: ', err);
					}); console.log('SENT SMS MESSAGE');
				} 
			}
		} else {
			console.log('Motion Off');
		}
	});
  
  var io = require('socket.io').listen( server.listener );
  io.on('connection', function( socket ) {
    console.log('connection: ', socket.id );
    socket.emit('event:hello');

	//LED
	socket.on('event:light', function () {
	  console.log("turn on light ", ledState);
	  ledState = !ledState;
	  led1.writeSync(ledState ? 1 : 0);
	  led2.writeSync(ledState ? 1 : 0);
	  led3.writeSync(ledState ? 1 : 0);
	  led4.writeSync(ledState ? 1 : 0);
	});
	//Buzzer
	socket.on('event:buzzer', function () {
	  buzzer.writeSync(1);
	  console.log("turn on buzzer ");
	  setTimeout(function () {
		  buzzer.writeSync(0);
	  }, 3000);
	});
	//SMS Notification
	socket.on('event:textSMS', function ( val ) {
	  smsControl = val ? 1 : 0;
	  if( smsControl ) {
		  console.log("Receive turn on SMS signal");
	  } else {
		  console.log("turn off SMS");
	  }
	});
	socket.on('event:motion:watch', function( val ) {
		motionWatch = val ? 1 : 0;
		if( motionWatch ) { console.log('listening for motion'); }
		else { console.log('not listening for motion'); }
	})
	//Raspicam
	socket.on('event:camera:photo', function(){
		camera.setMode('photo', function( imgUrl ){
		  console.log('taking photo');
		  liveState = 0;
		  imageData.push({url: imgUrl, id: count++, unread: 1});
		  camera.start(); 
		});
	});
	socket.on('event:camera:live', function(){
		console.log('going live');
		liveState = 1;
		camera.setMode('live');
	});
  });
  camera.setSocket( io );

  var state = false;
  setInterval( function(){
    io.sockets.emit('event:led:state', state = !state );
  }, 1000);

  console.log('Server Ready');
});

process.on('SIGINT', function(){
    motion.unexport();
    buzzer.unexport();
    led1.unexport();
    led2.unexport();
    led3.unexport();
    led4.unexport();
    process.exit();
});
