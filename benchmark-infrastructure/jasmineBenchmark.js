(function(window){

var currentTestName, lastTestResult, lastTestUnit;

var run = function (step, done) {
    var suite = new Benchmark.Suite;
    suite.add(currentTestName,
        step,
        {
            onStart: function () {},
            onComplete: function () {}
        }
    );

    suite.on('cycle', function(event) {
        $(document.body).append('<div>' + event.target.name + ' ' + event.target.hz.toFixed(2) + ' ops/sec' + '</div>');
        lastTestResult = event.target.hz;
        lastTestUnit = 'ops/sec';
    })
    .on('complete', function() {
        done();
    })
    .run({ 'async': true });
}

var runWhenReady = function (element, step, done) {
    var simpleRun = function() {
        run(step, done);
    };
    if (element.isReady) {
        simpleRun();
    } else {
        element.onReady = simpleRun;
    }
}

var consoleReporter = {
    specStarted: function(result) {
        currentTestName = result.fullName;
        lastTestResult = null;
        lastTestUnit = null;
    },
    specDone: function(result) {
        if (result.status !== 'disabled') {
            console.info('<<' + result.fullName + '@' + lastTestResult + '@' + lastTestUnit + '>>');
        }
    }
};

var JasmineBenchmark = {};

JasmineBenchmark.run = run;
JasmineBenchmark.runWhenReady = runWhenReady;
JasmineBenchmark.consoleReporter = consoleReporter;

window.JasmineBenchmark = JasmineBenchmark;
})(this);
