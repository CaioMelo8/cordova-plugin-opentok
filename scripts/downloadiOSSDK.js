#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = async function () {
  const iOSSdk = `OpenTok-iOS-2.27.2`;
  const iOSSdkUrl = `https://s3.amazonaws.com/artifact.tokbox.com/rel/otkit-ios-sdk-xcframework/${iOSSdk}.zip`;
  const iOSSdkSourceDir = "./OpenTok.xcframework";
  const iOSSdkDestDir = `./plugins/cordova-plugin-opentok/src/ios/`;

  try {
    console.log("Downloading OpenTok SDK...");
    await download(iOSSdkUrl, `./${iOSSdk}.zip`);
    console.log(`Downloaded OpenTok SDK to ${iOSSdk}.zip`);

    console.log(`Extracting ${iOSSdk}.zip...`);
    await exec(`tar -zxvf ./${iOSSdk}.zip`);
    console.log(`Extracted ${iOSSdk}.zip to ${iOSSdkSourceDir}`);

    console.log(`Moving ${iOSSdkSourceDir}...`);
    await exec(`mv ${iOSSdkSourceDir} ${iOSSdkDestDir}`);
    console.log(`Moved ${iOSSdkSourceDir} to ${iOSSdkDestDir}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  } finally {
    console.log(`Deleting ${iOSSdk}.zip...`);
    await exec(`rm ./${iOSSdk}.zip`);
    console.log(`Deleted ${iOSSdk}.zip`);
  }
};

async function download(url, destination) {
  const file = fs.createWriteStream(destination);

  await new Promise((resolve, reject) => {
    https
      .get(url, function (response) {
        response.pipe(file);

        file.on("finish", function () {
          file.close(resolve);
        });
      })
      .on("error", function (err) {
        fs.unlink(destination, () => {}); // Delete the file async. (But we don't check the result)

        reject(err);
      });
  });
}
