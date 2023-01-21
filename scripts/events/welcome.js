hexo.on("ready", () => {
  const { version } = require("../../package.json");

  const timeout = 3000; // 5 seconds

  Promise.race([
    fetch(`https://registry.npmjs.org/hexo-theme-redefine`),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    ),
  ])
    .then((res) => res.json())
    .then((data) => {
        hexo.log.info(
            `\n===================================================================\n      ______ __  __  ______  __    __  ______                       \r\n     \/\\__  _\/\\ \\_\\ \\\/\\  ___\\\/\\ \"-.\/  \\\/\\  ___\\                      \r\n     \\\/_\/\\ \\\\ \\  __ \\ \\  __\\\\ \\ \\-.\/\\ \\ \\  __\\                      \r\n        \\ \\_\\\\ \\_\\ \\_\\ \\_____\\ \\_\\ \\ \\_\\ \\_____\\                    \r\n         \\\/_\/ \\\/_\/\\\/_\/\\\/_____\/\\\/_\/  \\\/_\/\\\/_____\/                    \r\n                                                               \r\n ______  ______  _____   ______  ______ __  __   __  ______    \r\n\/\\  == \\\/\\  ___\\\/\\  __-.\/\\  ___\\\/\\  ___\/\\ \\\/\\ \"-.\\ \\\/\\  ___\\   \r\n\\ \\  __<\\ \\  __\\\\ \\ \\\/\\ \\ \\  __\\\\ \\  __\\ \\ \\ \\ \\-.  \\ \\  __\\   \r\n \\ \\_\\ \\_\\ \\_____\\ \\____-\\ \\_____\\ \\_\\  \\ \\_\\ \\_\\\\\"\\_\\ \\_____\\ \r\n  \\\/_\/ \/_\/\\\/_____\/\\\/____\/ \\\/_____\/\\\/_\/   \\\/_\/\\\/_\/ \\\/_\/\\\/_____\/\r\n                                                               \r\n  Github: https:\/\/github.com\/EvanNotFound\/hexo-theme-redefine\n      current verison is v${version},latest version is v${data["dist-tags"].latest}\n===================================================================`
          );
          if (data["dist-tags"].latest !== version) {
            console.log(
              `\x1b[33m%s\x1b[0m`,
              `Redefine v${version} is outdated, please update to v${data["dist-tags"].latest}!`
            );
        }
    })
    .catch((error) => {
      if (error.message === "timeout") {
        console.log(
          `Timeout: Could not fetch the package information within ${
            timeout / 1000
          } seconds`
        );
      } else {
        console.log(error);
      }
    });

});
