const pull = require('pull-stream');

//pull-steam

//a stream of random numbers.
function source (n) {
	return function (end, cb) {
		if(end) return cb(end)

		//only read n times, then stop.
		if(0 > --n) return cb(true)

		cb(null, Math.random())
	}
}

//volume changer
function through (read, map) {
	//return a readable function!
	return function (end, cb) {
		read(end, function (end, data) {
			cb(end, data != null ? map(data) : null)
		});
	}
}

//read source and log it.
function sink () {
	return function (read) {
		read(null, function next(end, data) {
			if(end === true) return
			if(end) throw end

			console.log(data)
			read(null, next)
		});
	}
}


// pull(source(), through(), sink());

// pull(
//   pull.values([1, 2, 3]),
//   pull.asyncMap((v) => v),
//   pull.collect(function (err, array) {
//     console.log(array)
//   })
// )
