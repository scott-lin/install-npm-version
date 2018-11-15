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
    package: 'package',
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
    return del([`${paths.build.output}/**/*`, `${paths.package}/**/*`]);
}

function runTests() {
    return gulp.src(`${paths.test}/**/*.spec.ts`)
        .pipe(mocha({
            reporter: 'nyan',
            require: ['ts-node/register']
        }));
}

function stagePackage() {
    gulp.src(['LICENSE', 'package.json', 'README.md'], { base: './' }).pipe(gulp.dest(`${paths.package}/`));
    gulp.src([`${paths.source}/**/*.d.ts`], { base: `${paths.source}/` }).pipe(gulp.dest(`${paths.package}/lib/`));
    
    return gulp.src([`${paths.build.output}/${paths.source}/**/*.js`], { base: `${paths.build.output}/${paths.source}/` })
        .pipe(gulp.dest(`${paths.package}/lib/`));
}

//
// Define gulp tasks.
//
gulp.task('default', gulp.series(clean, buildSource, gulp.parallel(runTests, stagePackage)));
gulp.task('build', gulp.series(clean, buildSource));
gulp.task('test', runTests);