#!/usr/bin/env node

module.exports = function (context) {
    var IosSDKDir = "OpenTok-iOS";
    var IosSDKVersion =  "2.19.0";
    var downloadFile = require('./downloadFile.js'),
        exec = require('./exec/exec.js'),
        Q = require('q'),
        deferral = new Q.defer();
    console.log('Downloading OpenTok iOS SDK');
    downloadFile('https://s3.amazonaws.com/artifact.tokbox.com/rel/ios-sdk/' + `${IosSDKDir}-${IosSDKVersion}` + '.tar.bz2',
        './' + `${IosSDKDir}-${IosSDKVersion}` + '.tar.bz2', function (err) {
            if (!err) {
                console.log('downloaded');
                exec('tar -zxvf ./' + `${IosSDKDir}-${IosSDKVersion}` + '.tar.bz2', function (err, out, code) {
                    console.log('expanded');
                    var frameworkDir = context.opts.plugin.dir + '/src/ios/';
                    exec('mv ./' + IosSDKDir + '/OpenTok.framework ' + frameworkDir, function (err, out, code) {
                        console.log('moved OpenTok.framework into ' + frameworkDir);
                        exec('rm -r ./' + IosSDKDir, function (err, out, code) {
                            console.log('Removed extracted dir');
                            exec('rm ./' + `${IosSDKDir}-${IosSDKVersion}` + '.tar.bz2', function (err, out, code) {
                                console.log('Removed downloaded SDK');
                                deferral.resolve();
                            });
                        });
                    });
                });
            }
        });
    return deferral.promise;
};
