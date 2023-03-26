/*
author: @jiangwen5945
date: 2023-03-10
*/

Global.initTyped = (id) => {
    const sentenceList = [];
    for (const t of Global.theme_config.home_banner.subtitle.text) {
      sentenceList.push(t);
    }
    const usrTypeSpeed = Global.theme_config.home_banner.subtitle.typing_speed;
    const usrBackSpeed = Global.theme_config.home_banner.subtitle.backing_speed;
    const usrBackDelay = Global.theme_config.home_banner.subtitle.backing_delay;
    const usrStartDelay = Global.theme_config.home_banner.subtitle.starting_delay;
    const usrLoop = Global.theme_config.home_banner.subtitle.loop;
    const usrSmartBackspace = Global.theme_config.home_banner.subtitle.smart_backspace;

    if(document.getElementById(id)){
      const st = new Typed("#"+id, {
        strings: sentenceList,
        typeSpeed: usrTypeSpeed || 100,//打字的速度
        smartBackspace: usrSmartBackspace || false, // 开启智能退格 默认false
        backSpeed: usrBackSpeed || 80,//后退速度
        backDelay: usrBackDelay || 1500,//后退延迟
        loop: usrLoop || false,//是否循环
        startDelay: usrStartDelay || 500,//起始时间
        // cursorChar: '♡', // 光标
      });
    }
}