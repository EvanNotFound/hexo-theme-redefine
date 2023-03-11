REDEFINE.initTyped = (id) => {
    const sentenceList = [];
    for (const t of REDEFINE.theme_config.style.first_screen.subtitle.list) {
      sentenceList.push(t);
    }
    if(document.getElementById(id)){
      const st = new Typed("#"+id, {
        strings: sentenceList,
        typeSpeed: 100,//打字的速度
        smartBackspace: true, // 开启智能退格 默认false
        backSpeed: 50,//后退速度
        backDelay: 1500,//后退延迟
        loop: false,//是否循环
        startDelay: 500,//起始时间
        // cursorChar: '♡', // 光标
      });
    }
}