/**
 * Theme Redefine
 * 404 error page
*/

hexo.extend.generator.register('404', function(locals){
  return {
    path: '404.html',
    layout: ['page'],
    data: {
      type: '404',
      top_img: false
    }
  }
});
