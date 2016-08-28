Compare streams vs pull-streams vs function chain.

Setup is source + mapper + destination, pressure is controlled by realtime output, we measure time it takes from getting signal of hunger till processing is done, average per audio frame.

### Results

* function ~.5ms per frame, 0ms overhead
* pull-stream ~.7ms per frame, ~.2ms overhead
* streams ~.85ms per frame, ~.35ms overhead
* audio-through ~1ms per frame, ~.5ms overhead
