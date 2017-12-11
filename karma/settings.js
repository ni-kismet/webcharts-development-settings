var module;

module.exports.getDefaultSettings = function ({ config = {}, fileGoups = [], lintPatterns = ['sources/**/*.js', 'tests/**/*.js'], coveragePatterns = ['sources/**/*.js'] }) {
    console.log(files);
    console.log(devFiles);

    var browsersMatrix = {
            'win': ['Edge', 'Firefox', 'Chrome'],
            'linux': ['Firefox', 'Chrome'],
            'mac': ['Safari', 'Firefox', 'Chrome']
        },
        isWin = /^win/.test(process.platform),
        isLinux = /^linux/.test(process.platform),
        isMac = /^darwin/.test(process.platform),
        currentOSType = isWin ? 'win' : (isLinux ? 'linux' : 'mac'),
        currentOSBrowsers = browsersMatrix[currentOSType];

    var settings = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-jquery', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'sources/**/*.js': ['eslint'],
            'tests/**/*.js': ['eslint']
        },

        eslint: {
            stopOnError: config.stopOnEsLintError ? true : false,
            showWarnings: false,
            engine: {
                configFile: 'node_modules/webcharts-development-settings/.eslintrc.json',
                emitError: true,
                emitWarning: true
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['kjhtml', 'spec'],

        coverageReporter: {
            type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
            dir: 'coverage/'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: currentOSBrowsers,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        reportSlowerThan: 160,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    };

    if (config.coverage) {
        settings.files = settings.files
            .concat(cssFiles)
            .concat(externalDependencies)
            .concat(elementInfrastructure)
            .concat(sources)
            .concat(externalMaps)
            .concat(elementRegistration)
            .concat(tests);
        var toBeInstrumented = ['sources/**/*.js'];
        if (!settings.preprocessors) {
            settings.preprocessors = {};
        }
        toBeInstrumented.forEach(function(pattern) {
            if (!settings.preprocessors[pattern]) {
                settings.preprocessors[pattern] = ['coverage'];
            } else {
                settings.preprocessors[pattern].push('coverage');
            }
        });
        settings.reporters.push('coverage');
        settings.reporters.push('coveralls');
        settings.browsers = ['Chrome'];
    } else if (config.benchmarks) {
        settings.files = settings.files
            .concat(cssFiles)
            .concat(externalDependencies)
            .concat(elementInfrastructure)
            .concat(sources)
            .concat(externalMaps)
            .concat(elementRegistration)
            .concat(benchmarks);
        var setupKarma = require('./node_modules/webcharts-development-settings/benchmark-infrastructure/setupKarma.js');
        setupKarma(settings);
    }
    else {
        settings.files = settings.files
            .concat(cssFiles)
            .concat(externalDependencies)
            .concat(elementInfrastructure)
            .concat(sources)
            .concat(externalMaps)
            .concat(elementRegistration)
            .concat(tests);
    }

    return settings;
};
