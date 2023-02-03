function odometer_init(){
    let el = document.getElementsByClassName('odometer');
    for (i = 0; i < el.length; i++) {
        od = new Odometer({
            el: el[i],
            format: '( ddd).dd',
            duration: 200,
        });
    }
}
if (REDEFINE.theme_config.pjax.enable === true && REDEFINE.utils) {
    odometer_init();
} else {
    window.addEventListener('DOMContentLoaded', odometer_init);
}