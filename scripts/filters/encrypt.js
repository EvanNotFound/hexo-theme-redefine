/* main hexo, __dirname */

"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const log = hexo.log;
const { hbeTheme } = require("./lib/hbe.default.js");

const defaultConfig = {
  abstract:
    "Here's something encrypted, password is required to continue reading.",
  message: "Hey, password is required here.",
  theme: "default",
  wrong_pass_message:
    "Oh, this is an invalid password. Check and try again, please.",
  wrong_hash_message:
    "OOPS, these decrypted content may changed, but you can still have a look.",
  silent: false,
};

const keySalt = textToArray("too young too simple");
const ivSalt = textToArray("sometimes naive!");

// As we can't detect the wrong password with AES-CBC,
// so adding an empty tag and check it when decrption.
const knownPrefix = "<hbe-prefix></hbe-prefix>";

// disable log
var silent = false;
// use default theme
var theme = "default";

hexo.extend.filter.register(
  "after_post_render",
  (data) => {
    const tagEncryptPairs = [];

    let password = data.password;
    let tagUsed = false;

    // use a empty password to disable category encryption
    if (password === "") {
      return data;
    }

    if (hexo.config.encrypt === undefined) {
      hexo.config.encrypt = [];
    }

    if ("encrypt" in hexo.config && "tags" in hexo.config.encrypt) {
      hexo.config.encrypt.tags.forEach((tagObj) => {
        tagEncryptPairs[tagObj.name] = tagObj.password;
      });
    }

    if (data.tags) {
      data.tags.forEach((cTag) => {
        if (tagEncryptPairs.hasOwnProperty(cTag.name)) {
          tagUsed = password ? tagUsed : cTag.name;
          password = password || tagEncryptPairs[cTag.name];
        }
      });
    }

    if (password == undefined) {
      return data;
    }

    password = password.toString();

    // make sure toc can work.
    data.origin = data.content;

    // Let's rock n roll
    const config = Object.assign(defaultConfig, hexo.config.encrypt, data);
    silent = config.silent;
    theme = config.theme.trim().toLowerCase();

    // deprecate the template keyword
    if (config.template) {
      dlog(
        "warn",
        'Looks like you use a deprecated property "template" to set up template, consider to use "theme"? See https://github.com/D0n9X1n/hexo-blog-encrypt#encrypt-theme',
      );
    }

    // read theme from file
    let template = hbeTheme;

    if (tagUsed === false) {
      dlog(
        "info",
        `hexo-blog-encrypt: encrypting "${data.title.trim()}" based on the password configured in Front-matter with theme: ${theme}.`,
      );
    } else {
      dlog(
        "info",
        `hexo-blog-encrypt: encrypting "${data.title.trim()}" based on Tag: "${tagUsed}" with theme ${theme}.`,
      );
    }

    data.content = knownPrefix + data.content.trim();
    data.encrypt = true;

    const key = crypto.pbkdf2Sync(password, keySalt, 1024, 32, "sha256");
    const iv = crypto.pbkdf2Sync(password, ivSalt, 512, 16, "sha256");

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const hmac = crypto.createHmac("sha256", key);

    let encryptedData = cipher.update(data.content, "utf8", "hex");
    hmac.update(data.content, "utf8");
    encryptedData += cipher.final("hex");
    const hmacDigest = hmac.digest("hex");

    data.content = template
      .replace(/{{hbeEncryptedData}}/g, encryptedData)
      .replace(/{{hbeHmacDigest}}/g, hmacDigest)
      .replace(/{{hbeWrongPassMessage}}/g, config.wrong_pass_message)
      .replace(/{{hbeWrongHashMessage}}/g, config.wrong_hash_message)
      .replace(/{{hbeMessage}}/g, config.message);
    data.content += `<link href="${hexo.config.root}css/hbe.style.css" rel="stylesheet" type="text/css"><script data-swup-reload-script type="module" src="${hexo.config.root}js/plugins/hbe.js"></script>
<script data-swup-reload-script type="module">
import {initHBE} from "${hexo.config.root}js/plugins/hbe.js";
  console.log("hexo-blog-encrypt: loaded.");
    initHBE();
</script>
`;
    data.excerpt = data.more = config.abstract;

    return data;
  },
  1000,
);

hexo.extend.generator.register("hexo-blog-encrypt", () => [
  {
    data: () =>
      fs.createReadStream(
        path.resolve(__dirname, `../../source/assets/hbe.style.css`),
      ),
    path: `css/hbe.style.css`,
  },
  {
    data: () =>
      fs.createReadStream(
        path.resolve(__dirname, "../../source/js/plugins/hbe.js"),
      ),
    path: "js/plugins/hbe.js",
  },
]);

// log function
function dlog(level, x) {
  switch (level) {
    case "warn":
      log.warn(x);
      break;

    case "info":
    default:
      if (silent) {
        return;
      }

      log.info(x);
  }
}

// Utils functions
function textToArray(s) {
  var i = s.length;
  var n = 0;
  var ba = new Array();

  for (var j = 0; j < i; ) {
    var c = s.codePointAt(j);
    if (c < 128) {
      ba[n++] = c;
      j++;
    } else if (c > 127 && c < 2048) {
      ba[n++] = (c >> 6) | 192;
      ba[n++] = (c & 63) | 128;
      j++;
    } else if (c > 2047 && c < 65536) {
      ba[n++] = (c >> 12) | 224;
      ba[n++] = ((c >> 6) & 63) | 128;
      ba[n++] = (c & 63) | 128;
      j++;
    } else {
      ba[n++] = (c >> 18) | 240;
      ba[n++] = ((c >> 12) & 63) | 128;
      ba[n++] = ((c >> 6) & 63) | 128;
      ba[n++] = (c & 63) | 128;
      j += 2;
    }
  }

  return new Uint8Array(ba);
}
