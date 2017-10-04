const fs = require('fs');

const lastBenchmarkResults = JSON.parse(fs.readFileSync('lastBenchmarkResults.json'));
const benchmarksResults = JSON.parse(fs.readFileSync('benchmarksResults.json'));
console.log(lastBenchmarkResults);

const allResults = benchmarksResults.concat(lastBenchmarkResults);

fs.writeFileSync('benchmarksResults.json', JSON.stringify(allResults, null, ' '));
console.log(benchmarksResults.length + ' previously saved results');
console.log(lastBenchmarkResults.length + ' results added');
console.log(allResults.length + ' results in total')
