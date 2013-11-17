var audioContext = null;
var graph;
var analyser;
var analyser2;
var data = new Uint8Array(512);
var freqs = new Float32Array(64);
var freqBytes = new Uint8Array(64);
var rafID;

function init(){
  graph = new Graph();
  graph.setup();
  setupAudio();
}
window.addEventListener("load", init );

function setupAudio() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new window.AudioContext();

  if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  }

  if (!navigator.getUserMedia) {
    alert("Error: getUserMedia not supported!");
    return;
  }

  navigator.getUserMedia({audio:true}, gotStream, function(e) {
          alert('Error getting audio');
          console.log(e);
      });

}

function gotStream(stream) {
  var input = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  input.connect(analyser);

  analyser2 = audioContext.createAnalyser();
  analyser2.fftSize = 128;
  analyser.connect(analyser2);
  // startup the main loop
  update();

  // start playing basic sound
  oscillator = audioContext.createOscillator();
  oscillator.connect(audioContext.destination); // Connect to speakers
  oscillator.start(0); // Start generating sound immediately
}

function update(){
  analyser.getByteTimeDomainData(data);
  
  var zeroCross = findFirstPositiveZeroCrossing(data, 512);
  if (zeroCross==0) zeroCross=1;
   
  graph.draw(data, zeroCross);

  var maxValue = findMaxTimeDomainValue(data);
  document.getElementById('maxValue').innerHTML = '' + maxValue;

  rafID = requestAnimFrame( update );
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var MINVAL = 134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.

function findFirstPositiveZeroCrossing(buf, buflen) {
  var i = 0;
  var last_zero = -1;
  var t;

  // advance until we're zero or negative
  while (i<buflen && (buf[i] > 128 ) )
    i++;

  if (i>=buflen)
    return 0;

  // advance until we're above MINVAL, keeping track of last zero.
  while (i<buflen && ((t=buf[i]) < MINVAL )) {
    if (t >= 128) {
      if (last_zero == -1)
        last_zero = i;
    } else
      last_zero = -1;
    i++;
  }

  // we may have jumped over MINVAL in one sample.
  if (last_zero == -1)
    last_zero = i;

  if (i==buflen)  // We didn't find any positive zero crossings
    return 0;

  // The first sample might be a zero.  If so, return it.
  if (last_zero == 0)
    return 0;

  return last_zero;
}

function findMaxTimeDomainValue(data) {
  var max = 0;
  var length = data.length;
  var i=0;

  while (i<length) {
    if(data[i] > max){
      max = data[i];
    }
    i++;
  }

  return max;
}