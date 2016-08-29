Compare streams vs pull-streams vs function chain.

Setup is source + mapper + destination, pressure is controlled by realtime output, we measure time it takes from getting signal of hunger till processing is done, average per audio frame of 1024 samples (23.2ms of audio).

### Results

* function ~.5ms per frame, 0% overhead
* pull-stream ~.7ms per frame, ~0.8% overhead
* streams ~.85ms per frame, ~1.5% overhead
* audio-through ~1ms per frame, ~2.1% overhead

### [Known latencies](https://en.wikipedia.org/wiki/Latency_(audio))

| Type | Latency |
|---|---|
| Minimal noticeable latency of a person hearing his voice | 15ms |
| Minimal noticeable latency of a person not hearing his voice | 20-30ms |
| Comfortable communication latency | < 200ms |
| Radio Broadcast | 10ms is the best, 100+ms is real |
| Telephone calls | 100-200ms |
| IP calls | 20-150ms |
| Internet radio | 200ms+ |
| Live performance | 3ms per 1m of air |
| DSP filters | .5ms - 15ms |
| ASIO drivers | 8ms |
