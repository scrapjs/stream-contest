'use strict';

const pull = require('pull-stream');
const toStream = require('pull-stream-to-stream');
const context = require('audio-context');
const util = require('audio-buffer-utils');
const now = require('right-now');


let duration = 5000;

let frameSize = 1024;

// function sine () {
//   return pull.infinite(function () {
//     return util.noise(util.create(frameSize))
//   })
// }

// function volume () {
//   return pull.map(function (data) {
//     util.fill(data, v => v * .01);
//     return data
//   })
// }


//Streams
const Readable = require('stream').Readable;
const Transform = require('stream').Transform;

let sine = Readable({
  highWaterMark: 0,
  objectMode: true,
  read: function (size) {
    this.push(util.noise(util.create(frameSize)));
  }
});

let volume = Transform({
  highWaterMark: 0,
  objectMode: true,
  transform: (chunk, enc, cb) => {
    util.fill(chunk, v => v * .01);
    cb(null, chunk);
  }
});


//create speaker routine
function speaker () {
  return function (read) {
    let sum = 0, count = 0;

    var bufferNode = context.createBufferSource()
    bufferNode.loop = true;
    bufferNode.buffer = util.create(2, frameSize)
    var node = context.createScriptProcessor(frameSize)
    node.addEventListener('audioprocess', function (e) {
      let t = now();
      count++;

      read(null, function (err, data) {
        util.copy(data, e.outputBuffer)
        sum += (now() - t);
      })
    });
    bufferNode.connect(node)
    node.connect(context.destination)
    bufferNode.start();


    setTimeout(() => {
  console.log(`Pull stream: ${sum}ms for ${count} frames, average ${sum/count}ms per frame`);

      node.disconnect();
      read(true, () => {});
    }, duration);
  }
}

// pull(sine(), volume(), speaker())
sine.pipe(volume).pipe(toStream.sink(speaker));
// toStream.source(sine).pipe(toStream(volume)).pipe(toStream(speaker));
