/**
 * @file Hexo Generator: Masonry Dimensions
 * @description Automatically fetches and caches dimensions for the masonry gallery images.
 * This script runs during the 'hexo g' or 'hexo s' process. It reads the image list
 * from the theme's config, fetches metadata for new images, reads from a local
 * cache for existing images, and injects the width and height back into the
 * theme's data in memory. This allows the EJS template to render <img> tags
 * with proper dimensions, enabling lazy loading without layout shift.
 * 
 * - In development mode (`hexo server`/`s`): Reads from the file cache but does not write to it, preventing build loops.
 */

const imageSize = require('../source/js/libs/image-size/dist/index.cjs');
const fs = require('fs');
const path = require('path');

// 注册一个 Hexo 生成器
hexo.extend.generator.register('masonry_dimensions', async function() {
  const themeConfig = hexo.theme.config;

  // 如果masonry配置没东西的话，快速跳过
  if (!themeConfig.masonry || !Array.isArray(themeConfig.masonry) || themeConfig.masonry.length === 0) {
    hexo.log.debug('Masonry: No masonry configuration found, skipping dimension generation.');
    return [];
  }

  const cacheDir = path.join(hexo.theme_dir, 'cache');
  const cachePath = path.join(cacheDir, '.masonry_cache.json');
  let cacheData = {};
  let usedCache = false; // 用于标记本次生成是否使用了缓存

  // 确保 cache 文件夹存在
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  if (fs.existsSync(cachePath)) {
    try {
      cacheData = JSON.parse(fs.readFileSync(cachePath));
    } catch (e) {
      hexo.log.warn("Masonry cache file is corrupted. Rebuilding from scratch.");
      cacheData = {};
    }
  }

  // 使用 Promise.all 并行处理所有图片，提高效率
  const processedImages = await Promise.all(themeConfig.masonry.map(async (image) => {
    
    // 如果配置文件中已经手动提供了宽高，则跳过，以手动为准
    if (image.width && image.height) {
      hexo.log.debug(`Masonry: Skipping, dimensions already provided for '${image.title}'`);
      return image;
    }

    // 如果图片URL不存在，返回默认值
    if (!image.image) {
      hexo.log.warn(`Masonry: URL missing for '${image.title}'. Using fallback dimensions.`);
      return { ...image, width: 500, height: 500 };
    }

    if (cacheData[image.image] && cacheData[image.image].width && cacheData[image.image].height) {
      hexo.log.debug(`Masonry:  -> Cache HIT for: '${image.title}'`);
      usedCache = true; // 标记我们使用了缓存
      // 将缓存的宽高合并到图片对象中
      return { ...image, ...cacheData[image.image] };
    }

    hexo.log.debug(`Masonry:  -> Cache MISS. Fetching dimensions for: '${image.title}'`);
    try {
      // 通过网络请求获取图片
      let dimensions;
      if (image.image.startsWith('http')){
        //从远程URL进行fetch
        const response = await fetch(image.image);
        if (!response.ok) {
          throw new Error(`Masonry: HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        // 使用 image-size 库从 Buffer 中解析尺寸
        dimensions = imageSize.imageSize(imageBuffer);
        hexo.log.info(`Masonry:  -> Fetched: ${image.image} [${dimensions.width}x${dimensions.height}]`);//允许用户看到图片的fetch情况，方便把握进度
      }
      else{
        //本地文件直接进行读取
        //TODO: local path must be relative to source_dir currently
        const imagePath = path.join(hexo.source_dir, image.image);
        if (!fs.existsSync(imagePath)) {
          throw new Error(`Local image not found at: ${imagePath}`);
        }
        const imageBuffer = fs.readFileSync(imagePath);
        dimensions = imageSize.imageSize(imageBuffer);
        hexo.log.info(`Masonry:  -> Reading local image: ${image.image} [${dimensions.width}x${dimensions.height}]`);
      }
      
      cacheData[image.image] = { width: dimensions.width, height: dimensions.height };

      // 返回一个包含原始信息和新增宽高的新对象
      return { ...image, width: dimensions.width, height: dimensions.height };

    } catch (e) {
      hexo.log.warn(`Masonry: Failed to fetch dimensions for ${image.image}. Using fallback. Error: ${e.message}`);
      // 如果获取失败，提供一个默认的方形宽高，避免布局崩溃
      return { ...image, width: 500, height: 500 };
    }
  }));

  const userInputCmd = hexo.env.cmd;
  const aliasMap = hexo.extend.console.alias;
  const canonicalName = aliasMap[userInputCmd] || userInputCmd;
  const isServerMode = canonicalName === 'server';
  if (isServerMode) {
    // 开发模式下，不更新文件缓存—— 否则文件缓存的更新会被检测到，导致不断触发网页重建
    hexo.log.debug(`Masonry: hexo server mode detected. File cache not updated.`);
  } else {
    // 生产模式下，更新文件缓存
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
    hexo.log.debug(`Masonry: File cache updated at .masonry_cache.json`);
  }

  if (usedCache) {
    hexo.log.info("Masonry: Some image dimensions were read from cache. If you've updated images and the gallery layout seems incorrect, please run 'hexo masonry-cache clean' to clear the cache or you can modify .masonry_cache.json yourself.");
  }

  // 最后用处理过的新数组，覆盖掉内存中旧的主题配置
  this.theme.config.masonry = processedImages;
  return []; // 生成器必须返回一个数组，我们这里不需要生成新页面，所以返回空数组
});