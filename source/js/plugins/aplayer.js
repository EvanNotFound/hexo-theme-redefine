const audioList = [];

for (const audio of REDEFINE.theme_config.plugins.aplayer.audio) {
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
    fixed: true,
    audio: audioList,
});