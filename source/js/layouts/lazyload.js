const initLazyLoad = () => {
  const imgs = document.querySelectorAll('img[data-src][lazyload]:not([loading])');
  let lastLoadTime = 0;

  const lazyLoadImages = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    const threshold = windowHeight * 2;

    imgs.forEach(img => {
      if (img.offsetTop - scrollTop < threshold) {
        img.setAttribute('loading', 'true');

        const temp = new Image();
        temp.src = img.getAttribute('data-src');

        temp.onload = () => {
          img.removeAttribute('lazyload');
          img.removeAttribute('data-src');
          img.setAttribute('src', temp.src);
          img.removeAttribute('loading');
        };

        temp.onerror = () => {
          img.removeAttribute('loading');
        };
      }
    });

    lastLoadTime = Date.now();
  };

  lazyLoadImages();

  window.addEventListener('scroll', () => {
    if (Date.now() - lastLoadTime > 50) {
      lazyLoadImages();
    }
  });
};