/**
 * Theme Redefine
 * welcome.js
 */
const { version } = require("../../package.json");
const https = require("https");
const axios = require("axios");

hexo.on("ready", async () => {
  const timeout = 5000; // 5 seconds
  const packageName = "hexo-theme-redefine";

  async function checkNpmPackage() {
    try {
      const response = await axios.get(
        `https://registry.npmjs.org/${packageName}`,
        { timeout: timeout },
      );
      const jsonData = response.data;

      // hexo.log.info(
      //   `\n===================================================================\n      ______ __  __  ______  __    __  ______                       \r\n     \/\\__  _\/\\ \\_\\ \\\/\\  ___\\\/\\ \"-.\/  \\\/\\  ___\\                      \r\n     \\\/_\/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-.\/\\ \\ \\  __\\                      \r\n        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r\n         \\\/_\/ \\\/_\/\\\/_\/\\\/_____\/\\\/_\/  \\\/_\/\\\/_____\/                    \r\n                                                               \r\n ______  ______  _____   ______  ______ __  __   __  ______    \r\n\/\\  == \\\/\\  ___\\\/\\  __-.\/\\  ___\\\/\\  ___\/\\ \\\/\\ \"-.\\ \\\/\\  ___\\   \r\n\\ \\  __<\\ \\  __\\\\ \\ \\\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r\n \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\\"\\_\\ \\_____\\ \r\n  \\\/_\/ \/_\/\\\/_____\/\\\/____\/ \\\/_____\/\\\/_\/   \\\/_\/\\\/_\/ \\\/_\/\\\/_____\/\r\n                                                               \r\n  Github: https:\/\/github.com\/EvanNotFound\/hexo-theme-redefine\n     current version v${version}, the latest version is v${jsonData["dist-tags"].latest}\n===================================================================`,
      // );

      hexo.log.info(
        `
      +======================================================================================+
      |                                                                                      |
      |    _____ _   _ _____ __  __ _____   ____  _____ ____  _____ _____ ___ _   _ _____    |
      |   |_   _| | | | ____|  \\/  | ____| |  _ \\| ____|  _ \\| ____|  ___|_ _| \\ | | ____|   |
      |     | | | |_| |  _| | |\\/| |  _|   | |_) |  _| | | | |  _| | |_   | ||  \\| |  _|     |
      |     | | |  _  | |___| |  | | |___  |  _ <| |___| |_| | |___|  _|  | || |\\  | |___    |
      |     |_| |_| |_|_____|_|  |_|_____| |_| \\_\\_____|____/|_____|_|   |___|_| \\_|_____|   |
      |                                                                                      |
      |                            current v${version}  latest v${jsonData["dist-tags"].latest}                             |
      |                  https://github.com/EvanNotFound/hexo-theme-redefine                 |
      +======================================================================================+
                      `,
      );

      if (jsonData["dist-tags"].latest > version) {
        hexo.log.warn(
          `\x1b[33m%s\x1b[0m`,
          `Redefine v${version} is outdated, please update to v${jsonData["dist-tags"].latest}!`,
        );
      }
    } catch (error) {
      hexo.log.info(
        `
      +======================================================================================+
      |                                                                                      |
      |    _____ _   _ _____ __  __ _____   ____  _____ ____  _____ _____ ___ _   _ _____    |
      |   |_   _| | | | ____|  \\/  | ____| |  _ \\| ____|  _ \\| ____|  ___|_ _| \\ | | ____|   |
      |     | | | |_| |  _| | |\\/| |  _|   | |_) |  _| | | | |  _| | |_   | ||  \\| |  _|     |
      |     | | |  _  | |___| |  | | |___  |  _ <| |___| |_| | |___|  _|  | || |\\  | |___    |
      |     |_| |_| |_|_____|_|  |_|_____| |_| \\_\\_____|____/|_____|_|   |___|_| \\_|_____|   |
      |                                                                                      |
      |                        current v${version}  fetch latest failed                           |
      |                  https://github.com/EvanNotFound/hexo-theme-redefine                 |
      +======================================================================================+
       `,
      );
      hexo.log.error(`Check latest version failed: ${error}`);
    }
  }

  await checkNpmPackage();

  const cdnTestEndpoints = {
    staticfile: {
      name: "Staticfile CDN",
      url: `https://cdn.staticfile.org/hexo-theme-redefine/${version}/js/main.js`,
      site: "https://staticfile.org/",
    },

    bootcdn: {
      name: "BootCDN",
      url: `https://cdn.bootcdn.net/ajax/libs/hexo-theme-redefine/${version}/js/main.js`,
      site: "https://www.bootcdn.cn/",
    },
  };

  const fetchCDNStatus = async (key, data) => {
    try {
      const res = await axios.head(data.url);
      if (res.status === 200) {
        // console.log(`\x1b[32m%s\x1b[0m`, `CDN test success: ${key}`);
      } else {
        hexo.log.warn(`\x1b[31m%s\x1b[0m`, `${data.name} CDN test failed.`);
      }
      hexo.locals.set(`cdnTestStatus_${key}`, res.status);
    } catch (error) {
      hexo.locals.set(`cdnTestStatus_${key}`, 404);
      hexo.log.warn(
        `\x1b[31m%s\x1b[0m`,
        `${key} CDN test failed. Falling back to local version.`,
      );
      hexo.log.warn(
        `\x1b[34m%s\x1b[0m`,
        `Redefine v${version} may not be available on ${data.name} yet. Check again later at ${data.site}.`,
      );
      hexo.log.warn(
        `\x1b[34m%s\x1b[0m`,
        `If you are not using ${data.name}, you can ignore this warning.`,
      );
    }
  };

  const testEndpoints = () => {
    return Promise.allSettled(
      Object.entries(cdnTestEndpoints).map(([key, url]) =>
        fetchCDNStatus(key, url),
      ),
    );
  };

  await testEndpoints();
});
