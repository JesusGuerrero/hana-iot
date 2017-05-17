//IOT sensors from raspberry pi
var gpio = require('onoff').Gpio,
    camera = require('./camera')(),
    led1 = new gpio(26, 'out'),
    led2 = new gpio(12, 'out'),
    led3 = new gpio(24, 'out'),
    led4 = new gpio(16, 'out'),
    motion = new gpio(21, 'in', 'both'),
    buzzer = new gpio(17, 'out');

var ledState = 0
	, smsControl = 0
	, count = 0
	, imageData = [];

// Twilio, the SMS system servicegit
var accountSid = 'ACa957470a6f2569a114d025aa45f1cc60';
var authToken = 'd8f064aabedfb2dfc678bb3c16c25e4f';
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

//ip address
process.env.NODE_URL='192.168.0.19';

require('mahrio').runServer( process.env, __dirname ).then( function( server ) {

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
			camera.setMode('photo', function( imgUrl ){
			  console.log('taking photo');
			  imageData.push({url: imgUrl, id: count++, unread: 1});
			  camera.start(); 
			});
			if( smsControl ) {
				client.messages.create({
					body: 'Peeper Feeder detects some motions, check it out on Peeper App ',
					to: '+14152143706',  // Text this number
					from: '+18436477132' // From a valid Twilio number
				}).then(function(message){
					console.log('SMS Sent: ', message.sid);
					smsControl = 0;
				}, function(err){ 
					console.log('SMS ERROR: ', err);
				});
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
	  //led2.writeSync(ledState);
	  //led3.writeSync(ledState);
	  //led4.writeSync(ledState);
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
	//Raspicam
	socket.on('event:camera:photo', function(){
		camera.setMode('photo', function( imgUrl ){
		  console.log('taking photo');
		  imageData.push({url: imgUrl, id: count++, unread: 1});
		  camera.start(); 
		});
	});
	socket.on('event:camera:live', function(){
		console.log('going live');
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
