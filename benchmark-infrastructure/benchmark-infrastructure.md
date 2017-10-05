# Benchmark infrastructure

## The goal
The goal of this infrastructure is to provide **minimum viable functionality** for tracking the performance while paying the **minimum cost** of developing and maintaining it.

## Features
Supported features:
* High confidence in the benchmark results
* Running all benchmarks at once
* Running the benchmarks selectively
* Running the benchmarks from multiple devices and browsers
* Saving the results for traking trends
* Viewing the trends

Features that are not supported and will not be supported in the near future:
* Automatically running the benchmarks on remote devices
* Automatically triggering the benchmark for each commit or PR
* Failing a build step or PR because the performance degraded

## Overview
In order to pay the minimum cost by writing as few lines of code as possible other existing tools have been wired together:
### Benchmark.js
This library is great running a series of benchmarks and returning  statistically significant results. But it lacks support for running the benchmarks selectively. The user of this framework doesn't have to deal with this library directly.
### Jasmine
The way Jasmine displays the tests in a hierarchical style makes finding a specific test very easy. This infrastructure provides pieces to take advantage of both Benchmark.js and Jasmine. By using ```jasmineBenchmark.run``` or ```jasmineBenchmark.runWhenReady``` any test is transformed in a benchmark: these helper functions are invoking the Benchmark.js under the hood and report the results in the UI next to the Jasmine reporter.
### Karma
Karma has a really nice feature of capturing the console logs of all the connected browsers from all devices and redirecting them to a text file. After Karma is stopped, a minimal processing is required to extract the results from the text file and save them in a json.
### engineering-flot
engineering-flot is used to present the trends.
### git
The results are being saved in a json file which is commited with the code in the same repo. This is not ideal, but it's a very cheap mechanism to track the progress and detect regression. The workflow is meant to save new results only when the user decides to while he has the freedom to run the benchmarks and compare the results as often as he wants to.

## Example
Each benchmark result is a collection of key-value pairs like this:
```js
{
  "hash": "771725e10b502a33584c909d9d5d859680c9305f",
  "dateTime": "2017-10-03T14:40:45.187Z",
  "browserFullName": "Firefox 55.0.0 (Windows 7 0.0.0)",
  "browser": "Firefox",
  "testName": "graph 10000_samples 1_plot line",
  "value": "357.05998483482415",
  "unit": "ops/sec"
}
```

## How tos

### How to setup the infrastructure for a new repo
1. Make sure ```webcharts-development-settings``` is added as a dev dependency in ```package.json``` and installed.
2. Include these required files in ```karma.conf.js```:
```js
'node_modules/webcharts-development-settings/benchmark-infrastructure/benchmark.js'
'node_modules/webcharts-development-settings/benchmark-infrastructure/jasmineBenchmark.js'
'node_modules/webcharts-development-settings/benchmark-infrastructure/setupJasmine.js'
```
3. Configure the karma server to log the output and be more tolerant with the slow tests. All the recommended settings can be applied in ```karma.conf.js``` like this:
```js
var setupKarma = require('./node_modules/webcharts-development-settings/benchmark-infrastructure/setupKarma.js');
setupKarma(settings);
```
4. Optionally add this helper scripts to the ```package.json``` file to speed up different operations:
```js
"benchmarks": "node node_modules/karma/bin/karma start --single-run --no-auto-watch --concurrency=1 --benchmarks --browsers=Firefox,Chrome & node node_modules/webcharts-development-settings/benchmark-infrastructure/lastBenchmarkResultsToJson.js",
"benchmarksInteractive": "node node_modules/karma/bin/karma start --benchmarks & node node_modules/webcharts-development-settings/benchmark-infrastructure/lastBenchmarkResultsToJson.js",
"lastBenchmarkResultsToJson": "node node_modules/webcharts-development-settings/benchmark-infrastructure/lastBenchmarkResultsToJson.js",
"saveLastBenchmarkResults": "node node_modules/webcharts-development-settings/benchmark-infrastructure/saveLastBenchmarkResults.js"
```
5. Setup karma to treat the benchmarks as a different test suite. Don't mix the normal tests with the benchmarks.
```js
if (config.benchmarks) {
    settings.files = settings.files
        .concat(sources)
        .concat(benchmarks);
}
```
6. Add a new rule to the .gitignore file to make sure you don't accidentally commit the files with temporary benchmark results:
```
lastBenchmarkResults.*
```
7. Make sure the .npmignore will ignore the files keeping the temporary benchmark results and the saved ones:
```
lastBenchmarkResults.txt
lastBenchmarkResults.json
benchmarkResults.json
```

### How to write a benchmark
1. Get access to the global object which can be used to spin up a benchmark and log the results:
```js
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
```console
karma --benchmarks
```

### How to run the benchmarks and keep the results for comparison
The recommendation is to setup the ```package``` file as discribed above and use this command:
```console
npm run benchmarks
```
This command will run all the benchmarks in all the specified browsers and save the results in a local temporary json file which can be used later to compare the results.

### How to run the benchmarks on other devices/browsers and keep the results for comparison
1. Start karma with this command:
```console
npm run benchmarksInteractive
```
This command is starting karma configured with no browsers. You can connect from any device or browser and run the benchmarks.
2. In order to store the results for comparison don't stop karma from the command line, but access this address from any browser to cleanly stop karma:
```
http://localhost:9876/stop
```
If everything worked well there should be 2 files in the root folder of your repo:
```
lastBenchmarkResults.txt
lastBenchmarkResults.json
```
The text file contains the log of the browser intercepted by karma. The json file is generated after the karma was stopped and contains the benchmark results parsed and nicely printed in the json format. Only the json file is meant to be used to view the results or save them.

### How to compare the last results against the saved onses
Open this file which will load, merge and present all the results:
```console
node_modules/webcharts-development-settings/benchmark-infrastructure/benchmarkViewer.html
```

### How to view the saved results
If you want to view only the saved results then make sure the ```lastBenchmarkResults.json``` file is deleted and open the viewer:
```console
node_modules/webcharts-development-settings/benchmark-infrastructure/benchmarkViewer.html
```

### How to (re)generate the lastBenchmarkResults.json file
It is possible to end up with the raw console logs saved in the ```lastBenchmarkResults.txt``` file but without ```lastBenchmarkResults.json```. The json version is required to compare the latest results against the saved ones or to push them in the history along with the previously saved results. Use this command to parse the text file and generate the json file containing the last benchmark results:
```console
npm run lastBenchmarkResultsToJson
```

### How to save the last benchmark results
1. Make sure there are no other pending changes. The benchmark results will include a git hash of the workspace HEAD to use it in the future for further references.
2. After running the benchmarks it is highly recommended to view and compare them against the previously saved results before saving them. If you are sure you want to save then use this command to apend the content of the ```lastBenchmarkResults.json``` to the ```benchmarkResults.json``` file:
```console
npm run saveLastBenchmarkResults
```
3. Commit the ```benchmarkResults.json``` file.
