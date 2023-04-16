hexo.extend.filter.register('after_post_render', function(data) {
    if (this.theme.config.articles.style.image_caption !== false) {
        const class_name='image-caption';
        if (data.layout === 'post' || data.layout === 'page' || data.layout === 'about') {
            data.content = data.content.replace(/(<img [^>]*alt="([^"]+)"[^>]*>)/g, `<figure class="${class_name}">$1<figcaption>$2</figcaption></figure>`);
        }
    }
    return data;
});