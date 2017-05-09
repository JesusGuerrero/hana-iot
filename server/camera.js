var Path = require('path'),
  Promise = require('promise'),
  RaspiCam = require('raspicam');

const EXEC = Promise.denodeify( require('child_process').exec );

var camera = null,
  socket = null,
  currentName = null,
  currentTime = null,
  type = 'video',
  isAvailable = true,
  videoPath = Path.normalize(__dirname + '/../videos/'),
  imagePath = Path.normalize(__dirname + '/../images/'),
  avconv = 'avconv -r 2 -i ' + imagePath + 'myImg_%04d.jpg -r 2 -vcodec libx264 -crf 20 -g 15 ',
  MP4box = 'MP4Box  -fps 23  -add ' + videoPath + 'video.h264 ';

var startFunction = function(){
  if( !isAvailable ) { return; }
  isAvailable = false;

  currentTime = new Date().toISOString();
  if( type === 'photo' ) {
    camera.set('output', imagePath + 'myImg_' + currentTime + '.jpg');
  } else if( type === 'video'){
    camera.set('output', videoPath + 'video.h264');
  }
  camera.start();
};
var stopFunction = function(){
  camera.stop();
};
var setModeFunction = function( mode ){
  if( !isAvailable ) { return; }
  type = ['live', 'photo','video','timelapse'].indexOf( mode ) >= 0 ? mode : type;
  if( mode === 'live' ) {
    EXEC('theuv')
        .then( function(){
            console.log('running uv4l');
        });
  } else {
    EXEC('sudo pkill uv4l');
    if( mode === 'photo' ) {
      camera = new RaspiCam({
        mode: 'photo',
        output: imagePath + 'image.jpg',
        height: 720,
        width: 1280,
        quality: 100
      });
    } else if( mode === 'timelapse' ){
      camera = new RaspiCam({
        mode: 'timelapse',
        output: imagePath + 'myImg_%04d.jpg',
        height: 720,
        width: 1280,
        quality: 100,
        timeout: 60000, // record for 60 seconds
        tl: 1000	  // take a picture every 1 second
      });
    } else if( mode === 'video' ){
      camera = new RaspiCam({
        mode: 'video',
        output: videoPath + 'video.h264',
        width: 1280,
        height: 720,
        bitrate: 3000000,
        timeout: 60000,
        framerate: 23
      });
    } 
  }
  camera.on('exit', onExit);
  camera.on('read', onRead);
  camera.on('stop', onStop);
};
var notifyClients = function( filepath ){
  var filename = filepath.split('/')[ filepath.split('/').length - 1];
  if( socket ) {
      // NOTIFY WHEN CAMERA FINISHED
      socket.emit('hardware:camera:done', filepath + filename);
      isAvailable = true;
    } else {
      isAvailable = true;
    }
};
var onExit = function(){

  if( type === 'video' ) {
    EXEC(MP4box + videoPath + 'video' + currentTime + '.mp4')
      .then( function(){
        EXEC('rm ' + videoPath + 'video.h264')
          .then( function(){ notifyClients(videoPath + 'video' + currentTime + '.mp4'); });
      });
  } else if (type === 'timelapse') {
    EXEC(avconv + videoPath + 'timelapse' + currentTime + '.mp4')
      .then( function(){
        EXEC('rm ' + imagePath + 'myImg*')
          .then( function(){ notifyClients(videoPath + 'timelapse' + currentTime + '.mp4'); });
      });
  } else {
    notifyClients(imagePath + 'myImg_' + currentTime + '.jpg');
  }
};
var onRead = function(){};
var onStop = function(){};

module.exports = function( ){
  camera = new RaspiCam({
    mode: 'video',
    output: videoPath + 'video.h264',
    width: 1280,
    height: 720,
    bitrate: 3000000,
    timeout: 10000,
    framerate: 23
  });

  camera.on('exit', onExit);

  return {
    start: startFunction,
    stop: stopFunction,
    setSocket: function( client ) {
      socket = client;
    },
    setMode: setModeFunction,
    status: function(){
      return {available: isAvailable, mode: type};
    }
  };
};
