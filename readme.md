Compare latencies caused by pull-streams vs streams vs audio-through vs etc.

Setup is noise generator + gain + speaker destination, pressure is controlled by realtime output, we measure time it takes from getting signal of hunger till processing is done, average per audio frame of 1024 samples (23.2ms of audio).

### Results

| Handler | Latrecy per 1024 sample frame (23.2ms) | Overhead |
|---|---|---|
| Function | .5ms | 0% |
| [pull-stream](https://github.com/pull-stream/pull-stream) | .7ms | 0.8% |
| [streams](https://nodejs.org/api/stream.html) | .85ms | 1.5% |
| [audio-through](https://github.com/audiojs/audio-through) | 1ms | 2.1% |
| TODO: GPU throughput | | |

### Latencies [¹](#reference)

| Type | Latency |
|---|---|
| Minimal noticeable latency of a person hearing his voice | 15ms |
| Minimal noticeable latency of a person not hearing his voice | 20..30ms |
| Comfortable communication latency | < 200ms |
| Radio Broadcast | 10ms minimum, > 100ms real |
| Telephone calls | 100..200ms |
| IP calls | 20..150ms |
| Internet radio | > 200ms |
| Live performance | 3ms per 1m of air |
| DSP filters | 0.5ms..15ms |
| ASIO drivers | 8ms |
| [FFT transform](https://github.com/scijs/fourier-transform/blob/master/benchmark.md) | 0.1ms |

<span id="reference">¹</span> [Reference](https://en.wikipedia.org/wiki/Latency_(audio))
