# Benchmark infrastructure

## How tos

### How to setup the infrastructure for a new repo
1. Include these required files in ```karma.conf.js```:
```
'node_modules/webcharts-development-settings/benchmark-infrastructure/benchmark.js'
'node_modules/webcharts-development-settings/benchmark-infrastructure/jasmineBenchmark.js'
'node_modules/webcharts-development-settings/benchmark-infrastructure/setupJasmine.js'
```
2. Configure the karma server to log the output and be more tolerant with the slow tests. All the recommended settings can be applied in ```karma.conf.js``` like this:
```
var setupKarma = require('./node_modules/webcharts-development-settings/benchmark-infrastructure/setupKarma.js');
setupKarma(settings);
```
3. Optionally add this helper scripts to the ```package.json``` file to speed up different operations:
```
"benchmarks": "node node_modules/karma/bin/karma start --single-run --no-auto-watch --concurrency=1 --benchmarks --browsers=Firefox,Chrome & node node_modules/webcharts-development-settings/benchmark-infrastructure/lastBenchmarkResultsToJson.js",
"benchmarksInteractive": "node node_modules/karma/bin/karma start --benchmarks & node node_modules/webcharts-development-settings/benchmark-infrastructure/lastBenchmarkResultsToJson.js",
"lastBenchmarkResultsToJson": "node node_modules/webcharts-development-settings/benchmark-infrastructure/lastBenchmarkResultsToJson.js",
"saveLastBenchmarkResults": "node node_modules/webcharts-development-settings/benchmark-infrastructure/saveLastBenchmarkResults.js"
```
4. Setup karma to treat the benchmarks as a different test suite. Don't mix the normal tests with the benchmarks.
```js
if (config.benchmarks) {
    settings.files = settings.files
        .concat(sources)
        .concat(benchmarks);
}
```
5. Add a new rule to the .gitignore file to make sure you don't accidentally commit the files with temporary benchmarks results:
```
lastBenchmarkResults.*
```
6. Make sure the .npmignore will ignore the files keeking the temporary benchmark results and the saved ones:
```
lastBenchmarkResults.*
benchmarkResults.json
```

### How to write a benchmark
1. Get access to the global object which can be used to spin up a benchmark and log the results:
```
jasmineBenchmark = window.JasmineBenchmark;
```
2. Write a new benchmark like a regular jasmine test and take advantage of the jasmineBenchmark:
```js
it('action to be benchmarked and conditions', function(done) {
    // setup
    jasmineBenchmark.run(function() {
        // action to be benchmarked
    }, done);
});
```
In case the action to be benchmarked has to wait for an element then you can use the ```runWhenReady``` helper method which implements under the hood the isReady-onReady pattern:
```js
it('action to be benchmarked and conditions', function(done) {
    // setup
    jasmineBenchmark.runWhenReady(element, function() {
        // action to be benchmarked
    }, done);
});
```
3. Include the benchmark files in karma. The recommended pattern for placing and naming these files is:
```
'benchmarks/*.Benchmark.js'
```

### How to run the benchmarks
Just invoke karma with the ```--benchmarks``` argument. Then run the benchmarks like any other test.
```
karma --benchmarks
```

### How to run the benchmarks and keep the results for comparison
The recommendation is to setup the ```package``` file as discribed above and use this command:
```
npm run benchmarks
```
This command will run all the benchmarks in all the specified browsers and save the results in a local temporary json file which can be used later to compare the results.

### How to run the benchmarks on other devices/browsers and keep the results for comparison
1. Start karma with this command:
```console
npm run benchmarksInteractive
```
This command is starting karma configured with no browsers. You can connect from any device or browser and run the benchmarks.
2. In order to store the results for comparison don't stop karma from the command line, but use access this address from browser to cleanly stop karma:
```
http://localhost:9876/stop
```
If everything worked well there should be 2 files in the root folder of your repo:
```
lastBenchmarkResults.txt
lastBenchmarkResults.json
```
The text file contains the log of the browser intercepted by karma. The json file is generated after the karma was stopped and contains the benchmarks results parsed and nicely printed in the json format. Only the json file is meant to be used to view the results or save them.

### How to compare the last results against the saved onses
Open this file which will load and merge all the results:
```bat
node_modules/webcharts-development-settings/benchmark-infrastructure/benchmarkViewer.html
```
