"use strict";

hexo.extend.filter.register('after_post_render', function(data) {
    if (data.exif) {
        // 给所有图片标签加上 data-exif="true"
        data.content = data.content.replace(/<img([^>]*)>/gi, function(match, attrs) {
            // 避免重复添加
            if (attrs.includes('data-exif=')) {
                return match;
            }
            return `<img${attrs} data-exif="true">`;
        });
    }
    return data;
});