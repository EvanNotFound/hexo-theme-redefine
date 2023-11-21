/**
 * Theme Redefine
 * welcome.js
 */
const { version } = require("../../package.json");
const https = require("https");

hexo.on("ready", async () => {
  const timeout = 3000;

  async function fetchRedefineInfo() {
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://redefine-version.ohevan.com/api/info`,
          { timeout: timeout },
          (response) => {
            let data = "";
            response.on("data", (chunk) => {
              data += chunk;
            });
            response.on("end", () => {
              const jsonData = JSON.parse(data);

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
      |                            current v${version}  latest v${jsonData.npmVersion}                             |
      |                  https://github.com/EvanNotFound/hexo-theme-redefine                 |
      +======================================================================================+
                      `,
              );

              if (jsonData.npmVersion > version) {
                hexo.log.warn(
                  `\x1b[33m%s\x1b[0m`,
                  `Redefine v${version} is outdated, please update to v${jsonData.npmVersion}!`,
                );
              }

              if (jsonData.staticfileCDN) {
                hexo.log.info(
                  `\x1b[32m%s\x1b[0m`,
                  `CDN available: StaticfileCDN`,
                );
                hexo.locals.set(`cdnTestStatus_staticfile`, 200);
              } else {
                hexo.log.warn(
                  `\x1b[31m%s\x1b[0m`,
                  `StaticfileCDN is unavailable yet.`,
                );
                hexo.locals.set(`cdnTestStatus_staticfile`, 404);
              }

              if (jsonData.bootCDN) {
                hexo.log.info(`\x1b[32m%s\x1b[0m`, `CDN available: BootCDN`);
                hexo.locals.set(`cdnTestStatus_bootcdn`, 200);
              } else {
                hexo.log.warn(
                  `\x1b[31m%s\x1b[0m`,
                  `BootCDN CDN is unavailable yet.`,
                );
                hexo.locals.set(`cdnTestStatus_bootcdn`, 404);
              }

              resolve();
            });
          },
        )
        .on("error", (error) => {
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
          reject(error);
        });
    });
  }

  try {
    await fetchRedefineInfo();
  } catch (error) {
    hexo.log.warn(`Check latest version failed: ${error}`);
    hexo.locals.set(`cdnTestStatus_bootcdn`, 404);
    hexo.locals.set(`cdnTestStatus_staticfile`, 404);
  }
});
