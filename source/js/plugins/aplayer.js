const audioList = [];
const isFixed = Global.theme_config.plugins.aplayer.type === "fixed"
const isMini = Global.theme_config.plugins.aplayer.type === "mini"

for (const audio of Global.theme_config.plugins.aplayer.audios) {
    const a = {
      name: audio.name,
      artist: audio.artist,
      url: audio.url,
      cover: audio.cover,
      lrc: audio.lrc,
      theme: audio.theme,
    };
    audioList.push(a);
}

const ap = new APlayer({
    container: document.getElementById('aplayer'),
    mini: isMini,
    fixed: isFixed,
    audio: audioList,

});