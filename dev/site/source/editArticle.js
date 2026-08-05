const { spawn } = require("child_process");
const os = require("os");

hexo.on("new", (data) => {
  const filename = data.path;
  const typoraPath = getTyporaPath();

  if (typoraPath) {
    spawn(typoraPath, [filename]);
  }
});

function getTyporaPath() {
  const platform = os.type();
  if (platform === "Darwin") {
    // MacOS
    return "/Applications/Typora.app/Contents/MacOS/Typora";
  } else if (platform === "Windows_NT") {
    // Windows
    return "C:\\Program Files\\Typora\\Typora.exe";
  } else {
    console.error("Unsupported platform:", platform);
    return null;
  }
}
