/**
 * Created by qin on 2017/11/1.
 */
var gulp = require('gulp');
var del = require('del');
var copy = require('copy');
//var minifyCss = require('gulp-cssnano');                     //- 压缩CSS为一行；
var rev = require('gulp-rev');                               //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');            //- 路径替换
var minifyHTML   = require('gulp-minify-html');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');

var js_src_path = 'WAP_Website/js/**/*.js';
var js_dest_path = 'WAP_Website/js_min';

var css_src_path = 'WAP_Website/css/**/*.css';
var css_dest_path = 'WAP_Website/css_min';

var json_path = 'WAP_Website/**/rev-manifest.json';

var html_src_path = 'WAP_Website/**/*.html';
var html_dest_path = 'WAP_Website';

//1. del template
gulp.task('clean', function(cb) {
    del([js_dest_path]);
    del([css_dest_path]);
    cb();
});


//3. compress js
gulp.task('minjs', function(cb) {
    gulp.src([js_src_path])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(js_dest_path))
        .pipe(rev.manifest())
        .pipe(gulp.dest(js_dest_path)
        );
    cb();
});


//4. compress css
gulp.task('mincss', function(cb) {
    gulp.src([css_src_path])
        .pipe(rev())
        .pipe(gulp.dest(css_dest_path))
        .pipe(rev.manifest())
        .pipe(gulp.dest(css_dest_path)
        );
    cb();
});


gulp.task('minhtml', function(cb) {
    gulp.src([json_path,html_src_path])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                './css/': './css_min/',
                './js/': './js_min/'
            }
        }) )
        .pipe(minifyHTML({
            empty:true,
            spare:true
        }) )
        .pipe(gulp.dest(html_dest_path)
        );
    cb();
});

gulp.task('default',['build']);

gulp.task('build', function (done) {
    runSequence(
        ['clean'],
        ['minjs'],
        ['mincss'],
        ['minhtml'],
        done);
});

