var Path = require('path'),
  Promise = require('promise'),
  RaspiCam = require('raspicam');

const EXEC = Promise.denodeify( require('child_process').exec );

var camera = null,
  socket = null,
  currentName = null,
  currentTime = null,
  currentMode = 'video',
  type = 'video',
  isAvailable = true,
  videoPath = Path.normalize(__dirname + '/public/videos/'),
  imagePath = Path.normalize(__dirname + '/public/images/'),
  avconv = 'avconv -r 2 -i ' + imagePath + 'myImg_%04d.jpg -r 2 -vcodec libx264 -crf 20 -g 15 ',
  MP4box = 'MP4Box  -fps 23  -add ' + videoPath + 'video.h264 ';
  console.log( videoPath, imagePath);

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

var setModeFunction = function( mode, callback ){
  if( !isAvailable ) { return; }
  type = ['live', 'photo','video','timelapse'].indexOf( mode ) >= 0 ? mode : type;
console.log(mode, currentMode );
  if( mode === 'live' && mode !== currentMode ) {
    console.log('switching to live');
    EXEC("sudo uv4l -nopreview --auto-video_nr --driver raspicam --encoding mjpeg --width 640 --height 480 --framerate 20 --server-option '--port=9090' --server-option '--max-queued-connections=30' --server-option '--max-streams=25' --server-option '--max-threads=29'")
      .then(function(error, stdout, stderr){
	console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        socket.emit('hardware:camera:done', 'live');
      });
    currentMode = 'live';
  } else if( mode !== 'live') {
    EXEC('sudo pkill uv4l').then(function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      console.log('killed u4vl');
      if( mode === 'photo' && mode !== currentMode ) {
        camera = new RaspiCam({
          mode: 'photo',
          output: imagePath + 'image.jpg',
          height: 720,
          width: 1280,
          quality: 100
        });
        currentMode = 'photo';
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
      if( typeof callback == 'function'){
        setTimeout( function(){ camera.on('exit', onExit); callback(); }, 1000 );
      }
    }, function(err){ console.log(err); });
  }
};
var notifyClients = function( filepath ){
  var filename = filepath.split('/')[ filepath.split('/').length - 1];
  if( socket ) {
      // NOTIFY WHEN CAMERA FINISHED
      socket.emit('hardware:camera:done', '/images/'+filename);
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
