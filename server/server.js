var gpio = require('onoff').Gpio,
    camera = require('./camera')(),
    cameraMode = camera.status().mode,
    led1 = new gpio(27, 'out'),
    led2 = new gpio(22, 'out'),
    buzzer = new gpio(12, 'out');

var ledState = 0;

process.env.NODE_URL='192.168.0.16';

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
      });
      //Buzzer
      socket.on('event:buzzer', function () {
          buzzer.writeSync(1);
          console.log("turn on buzzer ");
          setTimeout(function () {
              buzzer.writeSync(0);
          }, 3000);
      });
      //Raspicam
      socket.on('event:camera:photo', function(){
        
          camera.setMode('photo', function(){
	    console.log('inside callback');
	    camera.start(); 
          });
        
      });
      socket.on('event:camera:video', function(){
        if( cameraMode !== 'video') {
          camera.setMode('video');
          cameraMode = 'video';
        }
        camera.start();
      });
      socket.on('event:camera:timelapse', function(){
        if( cameraMode !== 'timelapse') {
          camera.setMode('timelapse');
          cameraMode = 'timelapse';
        }
        camera.start();
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

  var state = false;
  setInterval( function(){
    io.sockets.emit('event:led:state', state = !state );
  }, 1000);

  console.log('Server Ready');
});
