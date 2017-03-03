var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require("del");
var fs = require("fs");
var safeWriteFile = require('safe-write-file');
var argv = require('yargs').argv;

var ora = require('ora');
var spinner = ora('javascript is compile for production...');

var paths = {
	js: "./js/",
	css: "./css/",
	images: "./images/",
	dist: "./dist",
	ftp: "./ftp",
	help: "./help/",
	views: "./views"
};

function getHeader() {
	var template = ['/**',
		' * time: <%= time%>',
		' * site: <%= site%>',
		' * contact: <%= blog%>',
		' */',
		''
	].join('\n');
	return $.header(template, {
		time: new Date(),
		site: '',
		blog: 'www.zhaozhenfei.com'
	});
}

gulp.task("browserify", function() {
	gulp.src(paths.js + "*.js")
		.pipe($.browserify({
			insertGlobals: false
		}))
		.pipe(gulp.dest('./js/build/'));
});

gulp.task("uglify", function() {
	spinner.text = 'uglify running....';
	spinner.start();
	gulp.src(["./js/build/*.js"])
		.pipe($.uglify({
			compress: {
				drop_console: true,
				unused: true
			}
		}))
		.pipe(getHeader())
		.pipe(gulp.dest("./js/build/min/"));
	spinner.succeed()
});

// gulp.task('clean', function() {
// 	del([paths.dist]);
// });

gulp.task("build", function() {
	gulp.src(paths.images + "**/*").pipe(gulp.dest(paths.dist + "/images"));
	gulp.src(paths.css + "**/*").pipe(gulp.dest(paths.dist + "/css"));
	gulp.src(paths.js + "build/**/*").pipe(gulp.dest(paths.dist + "/js"));
	gulp.src(paths.views + "/*").pipe(gulp.dest(paths.dist + "/html"));
});

gulp.task("htmlmin",["build"], function() {
	gulp.src(paths.dist + "/html/*.html")
		.pipe($.minifyHtml({
			collapseWhitespace: false,
			minifyJS: true,
			minifyCSS: true
		}))
		.pipe(gulp.dest(paths.dist + "/html/"));
})



gulp.task('default',function(){ 
	
	gulp.run('browserify','uglify','htmlmin'); 
	 
});

gulp.task('watch', function() {
  
  gulp.watch(paths.js + "/*", ['browserify']);

});

