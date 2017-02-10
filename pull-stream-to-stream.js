'use strict';

const pull = require('pull-stream');
const toStream = require('pull-stream-to-stream');
const context = require('audio-context');
const util = require('audio-buffer-utils');
const now = require('right-now');


let duration = 5000;
let frameSize = 1024;


//state holders for speaker - a scheduled data and release callback.
let readyData, release;


let sum = 0, count = 0;

//create speaker routine
let bufferNode = context.createBufferSource();
bufferNode.loop = true;
bufferNode.buffer = util.create(2, frameSize);
let buffer = bufferNode.buffer;
let node = context.createScriptProcessor(frameSize);
node.addEventListener('audioprocess', function (e) {
  let t = now();
  count++;

  release && release();
  /*
  Here we release writable’s callback, which instantly "pulls" the whole stream chain synchronously.
   */

  util.copy(readyData || e.inputBuffer, e.outputBuffer);
  sum += (now() - t);
});
bufferNode.connect(node);
node.connect(context.destination);
bufferNode.start();



function sine () {
  return pull.infinite(function () {
    return util.noise(util.create(frameSize))
  })
}

function volume () {
  return pull.map(function (data) {
    util.fill(data, v => v * .01);
    return data
  })
}


//create speaker routine
function speaker () {
  return function (read) {
      read(null, function (err, data) {
        util.copy(data, e.outputBuffer);
      });
  }
}

let read = speaker();


let speaker = Writable({
  highWaterMark: 0,
  objectMode: true,
  write: (chunk, enc, cb) => {
    read();
    readyData = chunk;
    release = cb;
  }
});


// pull(sine(), volume(), speaker())
sine.pipe(volume).pipe(toStream.sink(speaker));
// toStream.source(sine).pipe(toStream(volume)).pipe(toStream(speaker));
