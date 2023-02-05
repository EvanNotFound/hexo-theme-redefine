/**
 * Theme Redefine
 * welcome.js
*/

hexo.on("ready", () => {
  const { version } = require("../../package.json");

  const https = require('https');
  const packageName = "hexo-theme-redefine";
  const timeout = 5000; // 5 seconds
  
  https.get(`https://registry.npmjs.org/${packageName}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
          data += chunk;
      });
      res.on('end', () => {
          const jsonData = JSON.parse(data);
          hexo.log.info(
            `\n===================================================================\n      ______ __  __  ______  __    __  ______                       \r\n     \/\\__  _\/\\ \\_\\ \\\/\\  ___\\\/\\ \"-.\/  \\\/\\  ___\\                      \r\n     \\\/_\/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-.\/\\ \\ \\  __\\                      \r\n        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r\n         \\\/_\/ \\\/_\/\\\/_\/\\\/_____\/\\\/_\/  \\\/_\/\\\/_____\/                    \r\n                                                               \r\n ______  ______  _____   ______  ______ __  __   __  ______    \r\n\/\\  == \\\/\\  ___\\\/\\  __-.\/\\  ___\\\/\\  ___\/\\ \\\/\\ \"-.\\ \\\/\\  ___\\   \r\n\\ \\  __<\\ \\  __\\\\ \\ \\\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r\n \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\\"\\_\\ \\_____\\ \r\n  \\\/_\/ \/_\/\\\/_____\/\\\/____\/ \\\/_____\/\\\/_\/   \\\/_\/\\\/_\/ \\\/_\/\\\/_____\/\r\n                                                               \r\n  Github: https:\/\/github.com\/EvanNotFound\/hexo-theme-redefine\n      current version is v${version},latest version is v${jsonData["dist-tags"].latest}\n===================================================================`
          );
          if (jsonData["dist-tags"].latest !== version) {
            console.log(
              `\x1b[33m%s\x1b[0m`,
              `Redefine v${version} is outdated, please update to v${jsonData["dist-tags"].latest}!`
            );
          }
      });
  }).setTimeout(timeout, () => {
      console.log(`Timeout: Could not fetch the package information within ${timeout/1000} seconds`);
      // continue with code execution here
  }).on('error', (error) => {
      console.log(`Error: Failed to fetch package information. ${error.message}`);
      hexo.log.info(
        `\n===================================================================\n      ______ __  __  ______  __    __  ______                       \r\n     \/\\__  _\/\\ \\_\\ \\\/\\  ___\\\/\\ \"-.\/  \\\/\\  ___\\                      \r\n     \\\/_\/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-.\/\\ \\ \\  __\\                      \r\n        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r\n         \\\/_\/ \\\/_\/\\\/_\/\\\/_____\/\\\/_\/  \\\/_\/\\\/_____\/                    \r\n                                                               \r\n ______  ______  _____   ______  ______ __  __   __  ______    \r\n\/\\  == \\\/\\  ___\\\/\\  __-.\/\\  ___\\\/\\  ___\/\\ \\\/\\ \"-.\\ \\\/\\  ___\\   \r\n\\ \\  __<\\ \\  __\\\\ \\ \\\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r\n \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\\"\\_\\ \\_____\\ \r\n  \\\/_\/ \/_\/\\\/_____\/\\\/____\/ \\\/_____\/\\\/_\/   \\\/_\/\\\/_\/ \\\/_\/\\\/_____\/\r\n                                                               \r\n  Github: https:\/\/github.com\/EvanNotFound\/hexo-theme-redefine\n      current version is v${version},check latest version failed\n===================================================================`
      );

      // continue with code execution here
  });


});
