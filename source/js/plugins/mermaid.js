function mermaidLightInit() {
    console.log('mermaidLightInit')
    //if (window.mermaid) {
        mermaid.initialize({
        theme: typeof REDEFINE.theme_config.mermaid !== 'undefined' && typeof REDEFINE.theme_config.mermaid.style !== 'undefined' && typeof REDEFINE.theme_config.mermaid.style.light !== 'undefined' ? REDEFINE.theme_config.mermaid.style.light : 'default',
        });
    //}
}

function mermaidDarkInit() {
    console.log('mermaidDarkInit')
    //if (window.mermaid) {
        mermaid.initialize({
        theme: typeof REDEFINE.theme_config.mermaid !== 'undefined' && typeof REDEFINE.theme_config.mermaid.style !== 'undefined' && typeof REDEFINE.theme_config.mermaid.style.dark !== 'undefined' ? REDEFINE.theme_config.mermaid.style.dark : 'dark',
        });
    //}
}

function checkModeStatus() {
    if (document.body.classList.contains('dark-mode')) {
        mermaidDarkInit();
    } else {
        mermaidLightInit();
    }
}

if (REDEFINE.theme_config.pjax.enable === true && REDEFINE.utils) {
    checkModeStatus();
} else {
    window.addEventListener('DOMContentLoaded', checkModeStatus);
}