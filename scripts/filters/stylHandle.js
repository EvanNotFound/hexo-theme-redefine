hexo.extend.filter.register('stylus:renderer', function (style) {
    function getProperty(obj, name) {
        name = name.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

        const split = name.split('.');
        let key = split.shift();

        if (!Object.prototype.hasOwnProperty.call(obj, key)) return '';

        let result = obj[key];
        const len = split.length;

        if (!len) return result || '';
        if (typeof result !== 'object') return '';

        for (let i = 0; i < len; i++) {
            key = split[i];
            if (!Object.prototype.hasOwnProperty.call(result, key)) return '';

            result = result[split[i]];
            if (typeof result !== 'object') return result;
        }

        return result;
    }


    style.define('sytl-url', function (data) {
        const value = getProperty(hexo.theme.config, data.val);
        const _js = hexo.extend.helper.get('js').bind(hexo);
        const urlRender = hexo.extend.helper.get('url_for').bind(hexo);
        const cdnProviders = {
            'unpkg': 'https://unpkg.com',
            'jsdelivr': 'https://cdn.jsdelivr.net/npm',
            'elemecdn': 'https://npm.elemecdn.com',
            'aliyun': 'https://evan.beee.top/projects',
            'custom': hexo.theme.config.cdn.custom_url,
        };

        const cdnPathHandle = (path) => {
            const cdnBase = cdnProviders[hexo.theme.config.cdn.provider] || cdnProviders.aliyun;
            const renderedPath = urlRender(path);

            if (hexo.theme.config.global.pjax === true) {
                if (hexo.theme.config.cdn.provider === 'custom') {
                    const customUrl = cdnBase.replace('${version}', themeVersion).replace('${path}', path);
                    return hexo.theme.config.cdn.enable
                        ? `${customUrl}`
                        : `${renderedPath}`;
                } else {
                    return hexo.theme.config.cdn.enable
                        ? `${cdnBase}/hexo-theme-redefine@${themeVersion}/source/${path}`
                        : `${renderedPath}`;
                }
            } else {
                if (hexo.theme.config.cdn.provider === 'custom') {
                    const customUrl = cdnBase.replace('${version}', themeVersion).replace('${path}', path);
                    return hexo.theme.config.cdn.enable
                        ? `${customUrl}`
                        : _js(path);
                } else {
                    return hexo.theme.config.cdn.enable
                        ? `${cdnBase}/hexo-theme-redefine@${themeVersion}/source/${path}`
                        : _js(path);
                }
            }
        };

        let t = '';

        if (Array.isArray(value)) {
            for (const p of value) {
                t += cdnPathHandle(p);
            }
        } else {
            t = cdnPathHandle(value);
        }

        return t;
    });
})