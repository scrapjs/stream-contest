const context = require('audio-context');
const util = require('audio-buffer-utils');


function values (ary) {
  var i = 0
  return function read(abort, cb) {
    if(i===ary.length || abort) return cb(true)
    cb(null, ary[i++])
  }
}


function sink (read) {
  read(null, function next (err, data) {
    if(err) return console.log(err)
    console.log(data)
    //recursively call read again!
    read(null, next)
  })
}


function map (mapper) {
  //a sink function: accept a source
  return function (read) {
    //but return another source!
    return function (abort, cb) {
      read(abort, function (err, data) {
        //if the stream has ended, pass that on.
        if(err) return cb(err)
        //apply a mapping to that data
        cb(null, mapper(data))
      })
    }
  }
}

var source = values([1,2,3])
var mapper = map(function (e) { return e*e })


function pull () {
  var args = [].slice.call(arguments)
  var s = args.shift()
  while(args.length) s = args.shift()(s)
  return s
}

function infinite () {
  var i = 0
  return function (abort, cb) {
    if(abort) return cb(abort)
    cb(null, i++)
  }
}

function take (n) {
  return function (read) {
    return function (abort, cb) {
      //after n reads, tell the source to abort!
      if(!n--) return read(true, cb)
      read(null, cb)
    }
  }
}


pull(infinite(), mapper, take(101), sink)
