const isDeveloperMode = hexo.config.theme_config?.developer?.enable === true;
hexo.config.stylus = {
    ...(hexo.config.stylus || {}),
    compress: !isDeveloperMode,
};

hexo.extend.filter.register('stylus:renderer', function (style) {
    style.define('url-for', function (data) {
        const urlRender = hexo.extend.helper.get('url_for').bind(hexo);

        const url = urlRender(data.val);

        return url;
    });
});
