/**
 * Theme Redefine
 * 404 error page
*/

hexo.extend.generator.register('404', function (locals) {
  return {
    path: '404.html',
    layout: '404',
    data: {
      title: 'Page Not Found',
      type: 'notfound',
      page: locals.pages.findOne({ path: '404.html' })
    }
  }
});
