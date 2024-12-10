// 从主题配置中获取 meting 配置
const metingConfig = theme.plugins.meting;
console.log('Meting Config:', metingConfig);

// 初始化播放器配置的函数
function initMetingPlayer() {
    // 检查必选参数
    if (!metingConfig.id || !metingConfig.server || !metingConfig.type) {
        console.error('Missing required parameters:', {
            id: metingConfig.id,
            server: metingConfig.server,
            type: metingConfig.type
        });
        return;
    }

    // 创建 meting-js 元素
    const metingElement = document.createElement('meting-js');
    
    // 设置必选属性
    metingElement.setAttribute('server', metingConfig.server);
    metingElement.setAttribute('type', metingConfig.type);
    metingElement.setAttribute('id', metingConfig.id);

    // 根据播放器类型设置 fixed 或 mini
    if (metingConfig.playerType === 'fixed') {
        metingElement.setAttribute('fixed', 'true');
    } else if (metingConfig.playerType === 'mini') {
        metingElement.setAttribute('mini', 'true');
    }

    // 设置其他可选属性
    if (metingConfig.autoplay !== undefined) {
        metingElement.setAttribute('autoplay', metingConfig.autoplay);
    }
    if (metingConfig.theme !== undefined) {
        metingElement.setAttribute('theme', metingConfig.theme);
    }
    if (metingConfig.loop !== undefined) {
        metingElement.setAttribute('loop', metingConfig.loop);
    }
    if (metingConfig.order !== undefined) {
        metingElement.setAttribute('order', metingConfig.order);
    }
    if (metingConfig.preload !== undefined) {
        metingElement.setAttribute('preload', metingConfig.preload);
    }
    if (metingConfig.volume !== undefined) {
        metingElement.setAttribute('volume', metingConfig.volume);
    }
    if (metingConfig.mutex !== undefined) {
        metingElement.setAttribute('mutex', metingConfig.mutex);
    }
    if (metingConfig.lrcType !== undefined) {
        metingElement.setAttribute('lrc-type', metingConfig.lrcType);
    }
    if (metingConfig.listFolded !== undefined) {
        metingElement.setAttribute('list-folded', metingConfig.listFolded);
    }
    if (metingConfig.listMaxHeight !== undefined) {
        metingElement.setAttribute('list-max-height', metingConfig.listMaxHeight);
    }
    if (metingConfig.storageName !== undefined) {
        metingElement.setAttribute('storage-name', metingConfig.storageName);
    }

    // 获取并清空 meting-container 容器
    const apContainer = document.getElementById('meting-container');
    if (apContainer) {
        apContainer.innerHTML = '';
        // 将 meting-js 元素添加到容器中
        apContainer.appendChild(metingElement);
    }

    console.log('Created meting element:', metingElement.outerHTML);
}

// 确保 DOM 加载完成后再执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMetingPlayer);
} else {
    initMetingPlayer();
}