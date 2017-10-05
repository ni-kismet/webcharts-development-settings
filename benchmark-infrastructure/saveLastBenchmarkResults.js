const fs = require('fs');

const lastBenchmarkResults = JSON.parse(fs.readFileSync('lastBenchmarkResults.json'));
console.log(lastBenchmarkResults);

const benchmarkResultsExists = fs.existsSync('benchmarkResults.json');
const benchmarkResults = benchmarkResultsExists ? JSON.parse(fs.readFileSync('benchmarkResults.json')) : [];

const allResults = benchmarkResults.concat(lastBenchmarkResults);

fs.writeFileSync('benchmarkResults.json', JSON.stringify(allResults, null, ' '));
console.log(benchmarkResults.length + ' previously saved results');
console.log(lastBenchmarkResults.length + ' results added');
console.log(allResults.length + ' results in total')
