module.exports = function(settings) {
    settings.reportSlowerThan = 0;
    settings.browsers = [];
    settings.browserDisconnectTimeout = 2 * 60 * 1000;
    settings.browserNoActivityTimeout = 2 * 60 * 1000;
    settings.browserDisconnectTolerance = 5;
    settings.logLevel = 'info';
    settings.client = { captureConsole: true };
    settings.browserConsoleLogOptions = {
        level:  'info',
        format: '===%b===%m===',
        path:   'lastBenchmarkResults.txt',
        terminal: true
    };
    console.log();
    console.log('Type \x1b[36m%s\x1b[0m in any browser to run the benchmarks and record the results.', '"ip:port/"');
    console.log('Type \x1b[36m%s\x1b[0m to stop karma.', '"ip:port/stop"');
    console.log('In case the results did`t got to lastBenchmarkResults.json type \x1b[36m%s\x1b[0m in the console.', '"node run saveLastBenchmarkResults"');
    console.log('Type \x1b[36m%s\x1b[0m in the console to save the results.', '"node run saveLastBenchmarkResults"');
    console.log();
}
