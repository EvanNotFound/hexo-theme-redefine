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
          `https://redefine-version.ohevan.com/api/v2/info`,
          { timeout: timeout },
          (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
              logFailedInfo();
              return reject(
                new Error(
                  `Failed to load page, status code: ${response.statusCode}`,
                ),
              );
            }
            let data = "";
            response.on("data", (chunk) => {
              data += chunk;
            });
            response.on("end", () => {
              try {
                const jsonData = JSON.parse(data);

                if (jsonData.status !== "success") {
                  logFailedInfo();
                  return reject(
                    new Error(`Failed to fetch data: ${jsonData.message}`),
                  );
                }

                const redefineData = jsonData.data;

                logInfo(redefineData);
                checkVersionAndCDNAvailability(redefineData);
                resolve();
              } catch (error) {
                logFailedInfo();
                reject(new Error(`JSON parse failed: ${error.message}`));
              }
            });
          },
        )
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  try {
    await fetchRedefineInfo();
  } catch (error) {
    hexo.log.warn(`Check latest version failed: ${error}`);
    hexo.locals.set(`cdnTestStatus_cdnjs`, 404);
    hexo.locals.set(`cdnTestStatus_zstatic`, 404);
    hexo.locals.set(`cdnTestStatus_npmMirror`, 404);
  }
});

function logInfo(data) {
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
      |                            current v${version}  latest v${data.npmVersion}                             |
      |                  https://github.com/EvanNotFound/hexo-theme-redefine                 |
      +======================================================================================+
                      `,
  );
}

function logFailedInfo() {
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
}

function checkVersionAndCDNAvailability(data) {
  if (data.npmVersion > version) {
    hexo.log.warn(
      `\x1b[33m%s\x1b[0m`,
      `Redefine v${version} is outdated, please update to v${data.npmVersion}!`,
    );
  }

  if (data.npmMirrorCDN) {
    hexo.log.info(
      `\x1b[32m%s\x1b[0m`,
      `CDN available: NPMMirror (Recommended)`,
    );
    hexo.locals.set(`cdnTestStatus_npmMirror`, 200);
  } else {
    hexo.log.warn(`\x1b[31m%s\x1b[0m`, `NPMMirror CDN is unavailable yet.`);
    hexo.locals.set(`cdnTestStatus_npmMirror`, 404);
  }

  if (data.zstaticCDN) {
    hexo.log.info(`\x1b[32m%s\x1b[0m`, `CDN available: ZStatic`);
    hexo.locals.set(`cdnTestStatus_zstatic`, 200);
  } else {
    hexo.log.warn(`\x1b[31m%s\x1b[0m`, `ZStatic CDN is unavailable yet.`);
    hexo.locals.set(`cdnTestStatus_zstatic`, 404);
  }

  if (data.cdnjsCDN) {
    hexo.log.info(`\x1b[32m%s\x1b[0m`, `CDN available: CDNJS`);
    hexo.locals.set(`cdnTestStatus_cdnjs`, 200);
  } else {
    hexo.log.warn(`\x1b[31m%s\x1b[0m`, `CDNJS CDN is unavailable yet.`);
    hexo.locals.set(`cdnTestStatus_cdnjs`, 404);
  }
}
