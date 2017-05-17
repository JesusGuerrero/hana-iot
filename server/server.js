//IOT sensors from raspberry pi
var gpio = require('onoff').Gpio,
    camera = require('./camera')(),
    led1 = new gpio(26, 'out'),
    led2 = new gpio(12, 'out'),
    led3 = new gpio(24, 'out'),
    led4 = new gpio(16, 'out'),
    motion = new gpio(21, 'in', 'both'),
    buzzer = new gpio(18, 'out');

var ledState = 0,
    textControl = 0;

// Twilio, the SMS system servicegit
   var accountSid = 'AC70731db98f0a7ad0863697704e8e4716';
   var authToken = '281c19c81e4762364b53524f5bf7eadc';
   var twilio = require('twilio');
   var client = new twilio(accountSid, authToken);

//ip address
process.env.NODE_URL='192.168.0.19';

require('mahrio').runServer( process.env, __dirname ).then( function( server ) {

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: ['../public/']
      }
    }
  });
  
/*
    client.messages.create({
        body: 'Server Running',
        to: '+14159990504',  // Text this number
        from: '+14159694541' // From a valid Twilio number
    }).then(function(message){
        console.log(message.sid)
        console.log('message sent');
    });
*/

  var io = require('socket.io').listen( server.listener );
  io.on('connection', function( socket ) {
    console.log('connection: ', socket.id );
    socket.emit('event:hello');

      //LED
      socket.on('event:light', function () {
          console.log("turn on light ");
          ledState = !ledState;
          led1.writeSync(ledState);
          led2.writeSync(ledState);
          led3.writeSync(ledState);
          led4.writeSync(ledState);
      });
      //Buzzer
      socket.on('event:buzzer', function () {
          buzzer.writeSync(1);
          console.log("turn on buzzer ");
          setTimeout(function () {
              buzzer.writeSync(0);
          }, 3000);
      });
      
      socket.on('event:textSMS', function () {
          textControl = !textControl;
          if (textControl){
              console.log("Receive turn on SMS signal");
              motion.watch( function(err, val) {
                  if( err ) { console.log('Motion in 21 Error'); return; }

                  if( val ) {
                      console.log('Motion in ON');
                      client.messages.create({
                          body: 'Peeper Feeder detects some motions, check it out on Peeper App ',
                          to: '+14159990504',  // Text this number
                          from: '+14159694541' // From a valid Twilio number
                      }).then(function(message){
                          console.log('message sent');
                      });

                  }
              });
          }else{
              console.log("turn off SMS");
          }
      });



      //motion sensor
      // motion.watch( function(err, val) {
      //     console.log('Motion active');
      //     if (err) {
      //         console.log('Motion in 21 Error');
      //         return;
      //     }
      //     if (val) {
      //         console.log('motion sensor detect something');
      //         // client.messages.create({
      //         //     body: 'Peeper Feeder detects some motions, check it out on Peeper App ',
      //         //     to: '+14159990504',  // Text this number
      //         //     from: '+14159694541' // From a valid Twilio number
      //         // }).then(function(message){
      //         //     console.log(message.sid)
      //         //     console.log('message sent');
      //         // });
      //     }
      // });

      //Raspicam
      socket.on('event:camera:photo', function(){
        camera.setMode('photo', function(){
	      console.log('inside callback');
	      camera.start(); 
        });
      });
      socket.on('event:camera:live', function(){
		console.log('going live');
        camera.setMode('live');
      });
  
    //BEGIN LISTENING FOR SOCKET MESSAGES FROM CLIENTS
    //Example:
    //socket.on('myCustomMessage', function( val ){ console.log( val ); });

  });
  camera.setSocket( io );

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
    process.exit();
});
