var DEFAULT_TIMEOUT_INTERVAL = 500000;
var jasmineBenchmark = window.JasmineBenchmark;
jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
jasmine.getEnv().addReporter(jasmineBenchmark.consoleReporter);
