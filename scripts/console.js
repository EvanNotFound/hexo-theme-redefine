/**
 * @file Hexo Console Commands for the Redefine Theme
 * @description Registers custom console commands for theme maintenance.
 */

const fs = require('fs');
const path = require('path');


/**
 * Registers the `hexo masonry-cache clean` command.
 *
 * This command allows the user to manually clear the image dimension cache
 * used by the masonry gallery generator. This is useful when images
 * in the gallery are updated or replaced without changing their URLs.
 */
hexo.extend.console.register('masonry-cache', 'Manage the masonry gallery dimension cache.', {
  arguments: [
    { name: 'op', desc: 'The operation to perform. Currently, only "clean" is supported.' }
  ]
}, function(args) {
  const operation = args._[0];

  if (operation === 'clean') {
    const cacheDir = path.join(this.theme_dir, 'cache');
    const cachePath = path.join(cacheDir, '.masonry_cache.json');
    
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath); // 同步删除文件
      this.log.info('✅ Success: Masonry dimension cache has been cleared.');
    } else {
      this.log.info('No masonry cache file found to clear.');
    }
  } else {
    this.log.warn('Unknown operation. Did you mean "clean"?');
    this.log.info('Usage: hexo masonry-cache clean');
  }
});