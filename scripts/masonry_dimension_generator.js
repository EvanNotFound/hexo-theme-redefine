/**
 * @file Hexo Generator: Masonry Dimensions
 * @description Automatically fetches dimensions for the masonry gallery images.
 * This script runs during the 'hexo g' or 'hexo s' process. It reads the image list
 * from the theme's config, fetches each image's metadata via network request,
 * and injects the width and height back into the theme's data in memory.
 * This allows the EJS template to render <img> tags with proper dimensions,
 * enabling lazy loading without layout shift in the masonry gallery.
 */

const imageSize = require('image-size');
const fetch = require('node-fetch');

// 注册一个 Hexo 生成器
hexo.extend.generator.register('masonry_dimensions', async function() {
  //hexo.log.info("Starting masonry dimension generator...");
  const themeConfig = this.theme.config;

  //hexo.log.info("Fetching masonry image dimensions, this may take a moment...");
  // 使用 Promise.all 并行处理所有图片，提高效率
  const processedImages = await Promise.all(themeConfig.masonry.map(async (image) => {
    
    // 如果配置文件中已经手动提供了宽高，则跳过，以手动为准
    if (image.width && image.height) {
      hexo.log.debug(`Masonry: Skipping, dimensions already provided for '${image.title}'`);
      return image;
    }

    // 如果图片URL不存在，也跳过
    if (!image.image) {
      hexo.log.warn(`Masonry: Skipping, URL missing for '${image.title}'`)
      return image;
    }

    try {
      // 通过网络请求获取图片的前几个字节就足够了(不确定对本地存储的图片效果怎么样)
      const response = await fetch(image.image);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 将响应转换为 Buffer
      const imageBuffer = await response.buffer();
      
      // 使用 image-size 库从 Buffer 中解析尺寸
      const dimensions = imageSize.imageSize(imageBuffer);
      //hexo.log.info(`  -> Fetched: ${image.image} [${dimensions.width}x${dimensions.height}]`);
      
      // 返回一个包含原始信息和新增宽高的新对象
      return { ...image, width: dimensions.width, height: dimensions.height };

    } catch (e) {
      hexo.log.warn(`Failed to fetch dimensions for ${image.image}. Using fallback. Error: ${e.message}`);
      // 如果获取失败，提供一个默认的方形宽高，避免布局崩溃
      return { ...image, width: 500, height: 500 };
    }
  }));

  // 最后用处理过的新数组，覆盖掉内存中旧的主题配置
  this.theme.config.masonry = processedImages;
  return []; // 生成器必须返回一个数组，我们这里不需要生成新页面，所以返回空数组
});