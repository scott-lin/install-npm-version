const del = require('del');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const ts = require('gulp-typescript');

//
// Define path constants.
//
const paths = {
    build: {
        output: 'built'
    },
    source: 'src',
    test: 'test',
    typescript: {
        config: 'tsconfig.json'
    }
};

//
// Define task building block functions.
//
var tsProject = ts.createProject(paths.typescript.config);

function buildSource() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(paths.build.output));
}

function clean() {
    return del([`${paths.build.output}/**/*`]);
}

function runTests() {
    return gulp.src(`${paths.test}/**/*.spec.ts`)
        .pipe(mocha({
            reporter: 'nyan',
            require: ['ts-node/register']
        }));
}

//
// Define gulp tasks.
//
var build = gulp.series(buildSource);
var defaultTasks = [clean, build];

gulp.task('default', gulp.series(defaultTasks));
gulp.task('test', runTests);