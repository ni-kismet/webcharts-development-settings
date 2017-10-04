const fs = require('fs');
const child_process = require('child_process');

var results = [],
    dateTime = new Date().toISOString(),
    hash = child_process.execSync('git rev-parse HEAD', { encoding: 'utf8' }).replace('\n', '');

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('lastBenchmarkResults.txt')
});

lineReader.on('line', function (line) {
    // Examples:
    // ===Mobile Safari 10.0.0 (iOS 10.3.3)==='<<graph 10000_samples 1_plot scatter circle@16.552009517405505@ops/sec>>'===
    // ===Firefox 10.0.0 (Windows 10 0.0.0)==='<<graph 10000_samples 1_plot scatter circle@16.552009517405505@ops/sec>>'===
    var regexp = /===(([A-Za-z ]+) [0-9].+)==='<<(.+)@(.+)@(.*)>>'===/,
        matches = regexp.exec(line);
    if (matches) {
        var result = {
            hash: hash,
            dateTime: dateTime,
            browserFullName: matches[1],
            browser: matches[2],
            testName: matches[3],
            value: matches[4],
            unit: matches[5]
        };
        results.push(result);
    }
})
.on('close', function() {
    fs.writeFileSync('lastBenchmarkResults.json', JSON.stringify(results, null, ' '));
    console.log(results);
    console.log(results.length + ' new results');
});
