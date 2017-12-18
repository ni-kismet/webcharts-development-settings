var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var maps = require('gulp-sourcemaps');
var gulpSequence = require('gulp-sequence');
var files = require('../../../files.json');

var getBuildTaskName = (buildItem) => 'build_' + buildItem.output;
var buildTaskNames = files.gulp.build.map(getBuildTaskName);

gulp.task('build', gulpSequence.apply(null, buildTaskNames));

files.gulp.build.forEach(function(buildItem) {
    gulp.task(getBuildTaskName(buildItem), function() {
        console.log(__dirname);
        console.log(__filename);
        return gulp.src(concatFiles(files.groups, buildItem.input))
            .pipe(maps.init())
            .pipe(babel({
                presets: ['es2015'],
                plugins: ['external-helpers-2']
            }))
            .pipe(concat(buildItem.output))
            .pipe(uglify())
            .pipe(maps.write('./'))
            .pipe(gulp.dest('../../../dist/es5-minified'));
    });
});

function concatFiles(groups, names) {
    return Object.keys(groups)
        .filter(key => names.includes(key))
        .map(key => groups[key])
        .reduce((flat, group) => flat.concat(group), []);
}
