/// <binding AfterBuild='buildDev' ProjectOpened='watch' />
var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var remoteFolder = '/site/wwwroot/'

function getFtpConnectionDEV() {
    return ftp.create({
        host: 'waws-prod-blu-059.ftp.azurewebsites.windows.net',
        user: 'AdminPortalDev\\grunt7',
        pass: 'th3#1gr00nt',
        log: gutil.log,
        parallel: 5,
        maxConnections: 5,
        reload: true
    });
}


gulp.task('deploy-DEV',  function () {
    var conn = getFtpConnectionDEV();
    return gulp.src(['dist/**']
    , { buffer: false })
        .pipe(conn.newerOrDifferentSize(remoteFolder)) // only upload newer files 
        .pipe(conn.dest(remoteFolder))
});


function getFtpConnectionQA() {
    return ftp.create({
        host: 'waws-prod-blu-059.ftp.azurewebsites.windows.net',
        user: 'AdminPortalQA\\grunt7',
        pass: 'th3#1gr00nt',
        log: gutil.log,
        parallel: 5,
        maxConnections: 5,
        reload: true
    });
}


gulp.task('deploy-QA', function () {
    var conn = getFtpConnectionQA();

    return gulp.src(['dist/**']
   , { buffer: false })
       .pipe(conn.newerOrDifferentSize(remoteFolder)) // only upload newer files 
       .pipe(conn.dest(remoteFolder))
});


function getFtpConnectionProd() {
    return ftp.create({
        host: 'waws-prod-blu-063.ftp.azurewebsites.windows.net',
        user: 'AdminPortalWVProd\\grunt7',
        pass: 'th3#1gr00nt',
        log: gutil.log,
        parallel: 5,
        maxConnections: 5,
        reload: true
    });
}


gulp.task('deploy-PROD', function () {
    var conn = getFtpConnectionProd();

    return gulp.src(['dist/**']
   , { buffer: false })
       .pipe(conn.newerOrDifferentSize(remoteFolder)) // only upload newer files 
       .pipe(conn.dest(remoteFolder))
});