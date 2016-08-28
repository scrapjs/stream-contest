'use strict';

const pull = require('pull-stream');
const context = require('audio-context');
const util = require('audio-buffer-utils');
const now = require('right-now');


let duration = 5000;
let frameSize = 1024;

let sum = 0, count = 0;

var bufferNode = context.createBufferSource()
bufferNode.loop = true;
bufferNode.buffer = util.create(2, frameSize)
var node = context.createScriptProcessor(frameSize)
node.addEventListener('audioprocess', function (e) {
  let t = now();
  count++;

  let data = util.noise(util.create(frameSize))
  util.copy(data, e.outputBuffer)
  sum += (now() - t);
});
bufferNode.connect(node)
node.connect(context.destination)
bufferNode.start();


setTimeout(() => {
  console.log(`Function: ${sum}ms for ${count} frames, average ${sum/count}ms per frame`);

  node.disconnect();
}, duration);
