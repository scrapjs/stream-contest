const context = require('audio-context');
const util = require('audio-buffer-utils');


let frameSize = 1024;

//state holders for speaker - a scheduled data and release callback.
let readyData, release;


//create speaker routine
let bufferNode = context.createBufferSource();
bufferNode.loop = true;
bufferNode.buffer = util.create(2, frameSize);
let buffer = bufferNode.buffer;
let node = context.createScriptProcessor(frameSize);
node.addEventListener('audioprocess', function (e) {
	/*
	Here we release writable’s callback, which instantly "pulls" the whole stream chain synchronously.
	 */
	release();

	util.copy(readyData || e.inputBuffer, e.outputBuffer);
});
bufferNode.connect(node);
node.connect(context.destination);
bufferNode.start();



//Streams
const Readable = require('stream').Readable;
const Transform = require('stream').Transform;
const Writable = require('stream').Writable;

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

let speaker = Writable({
	highWaterMark: 0,
	objectMode: true,
	write: (chunk, enc, cb) => {
		readyData = chunk;
		release = cb;
	}
});


sine.pipe(volume).pipe(speaker);
