'use strict';
var gpio = require('onoff').Gpio,
  RaspiCam = require('raspicam'),
    led1 = new gpio(27, 'out'),
  buzzer = new gpio(16, 'out');

var ledState = 0;
var io = null;

function main( server ){
  io = require('socket.io').listen( server.listener );

  io.on('connection', function( socket ){
    console.log('socket listening...' + socket.id); // Record the connection

    socket.emit( 'event:hello' ); // Send message exclusively to new connection


   socket.on('event:buzzer', function () {
     buzzer.writeSync(1);
     console.log("turn on buzzer ");
     setTimeout(function () {
       buzzer.writeSync(0);
     }, 3000);
   });

   socket.on('event:video', function () {
     console.log("record a video");
   });
   socket.on('event:lightController', function () {

       ledState = ledState ? 0 : 1;
       led1.writeSync(ledState);
   });


    socket.on( 'disconnect', function(){
      console.log('goodbye socket...' + socket.id ); // Record the disconnection
    });
  });

  return io;
}

module.exports = main;
