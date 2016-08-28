Compare streams vs pull-streams vs function chain.

Setup is source + mapper + destination, pressure is controlled by realtime output, we measure time it takes from getting signal of hunger till processing is done, average per audio frame.

### Results

* streams ~1.1ms per frame, or 230ms for 5s of audio
* pull-stream ~.8ms per frame, or 187ms for 5s of audio
* function ~5ms per frame, or 100ms for 5s of audio
