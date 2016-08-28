'use strict';

const Through = require('audio-through');
const context = require('audio-context');
const util = require('audio-buffer-utils');
const now = require('right-now');


let duration = 5000;

let frameSize = 1024;

let release, readyData;
let sum = 0, count = 0;

var bufferNode = context.createBufferSource()
bufferNode.loop = true;
bufferNode.buffer = util.create(2, frameSize)
var node = context.createScriptProcessor(frameSize)
node.addEventListener('audioprocess', function (e) {
  let t = now();
  count++;

  release && release();

  util.copy(readyData || e.inputBuffer, e.outputBuffer);
  sum += (now() - t);
});
bufferNode.connect(node)
node.connect(context.destination)
bufferNode.start();


Through(util.noise)
.pipe(Through(buffer => util.fill(buffer, v => v * .01)))
.pipe(Through((buffer, done) => {
  readyData = buffer;
  release = done;
}));


setTimeout(() => {
  console.log(`Audio through: ${sum}ms for ${count} frames, average ${sum/count}ms per frame`);

  node.disconnect();
}, duration);


