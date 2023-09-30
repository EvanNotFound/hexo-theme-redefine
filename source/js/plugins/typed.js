/*
author: @jiangwen5945 & EvanNotFound
*/
export const config = {
  usrTypeSpeed: Global.theme_config.home_banner.subtitle.typing_speed,
  usrBackSpeed: Global.theme_config.home_banner.subtitle.backing_speed,
  usrBackDelay: Global.theme_config.home_banner.subtitle.backing_delay,
  usrStartDelay: Global.theme_config.home_banner.subtitle.starting_delay,
  usrLoop: Global.theme_config.home_banner.subtitle.loop,
  usrSmartBackspace: Global.theme_config.home_banner.subtitle.smart_backspace,
  usrHitokotoAPI: Global.theme_config.home_banner.subtitle.hitokoto.api,
};

export default function initTyped(id) {
  const {
    usrTypeSpeed,
    usrBackSpeed,
    usrBackDelay,
    usrStartDelay,
    usrLoop,
    usrSmartBackspace,
    usrHitokotoAPI,
  } = config;

  function typing(dataList) {
    const st = new Typed("#" + id, {
      strings: [dataList],
      typeSpeed: usrTypeSpeed || 100,
      smartBackspace: usrSmartBackspace || false,
      backSpeed: usrBackSpeed || 80,
      backDelay: usrBackDelay || 1500,
      loop: usrLoop || false,
      startDelay: usrStartDelay || 500,
    });
  }

  if (Global.theme_config.home_banner.subtitle.hitokoto.enable) {
    fetch(usrHitokotoAPI)
      .then((response) => response.json())
      .then((data) => {
        typing(data.hitokoto);
      })
      .catch(console.error);
  } else {
    const sentenceList = [...Global.theme_config.home_banner.subtitle.text];
    if (document.getElementById(id)) {
      const st = new Typed("#" + id, {
        strings: sentenceList,
        typeSpeed: usrTypeSpeed || 100,
        smartBackspace: usrSmartBackspace || false,
        backSpeed: usrBackSpeed || 80,
        backDelay: usrBackDelay || 1500,
        loop: usrLoop || false,
        startDelay: usrStartDelay || 500,
      });
    }
  }
}
