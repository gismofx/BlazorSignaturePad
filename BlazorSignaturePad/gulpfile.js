/// <binding AfterBuild='default' Clean='clean' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/
var gulp = require("gulp");
var del = require("del");
var paths = {
    scripts: ["./npm/src/**/*.js", "./npm/src/**/*.ts", "./npm/src/**/*.map"],
};
gulp.task("clean", function () {
    return del(["wwwroot/**/*"]);
});
gulp.task("default", async function () {
    gulp.src(paths.scripts).pipe(gulp.dest("wwwroot/"));
});