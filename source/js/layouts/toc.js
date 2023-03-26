/* global function */
function initTOC() {
  Global.utils.navItems = document.querySelectorAll('.post-toc-wrap .post-toc li');

  if (Global.utils.navItems.length > 0) {

    Global.utils = {

      ...Global.utils,

      updateActiveTOCLink() {
        if (!Array.isArray(Global.utils.sections)) return;
        let index = Global.utils.sections.findIndex(element => {
          return element && element.getBoundingClientRect().top - 200 > 0;
        });
        if (index === -1) {
          index = Global.utils.sections.length - 1;
        } else if (index > 0) {
          index--;
        }
        this.activateTOCLink(index);
      },

      registerTOCScroll() {
        Global.utils.sections = [...document.querySelectorAll('.post-toc li a.nav-link')].map(element => {
          const target = document.getElementById(decodeURI(element.getAttribute('href')).replace('#', ''));
          element.addEventListener('click', event => {
            event.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY;
            window.anime({
              targets: document.scrollingElement,
              duration: 500,
              easing: 'linear',
              scrollTop: offset - 10,
              complete: function () {
                setTimeout(() => {
                  Global.utils.pageTop_dom.classList.add('hide');
                }, 100)
              }
            });
          });
          return target;
        });
      },



      activateTOCLink(index) {
        const target = document.querySelectorAll('.post-toc li a.nav-link')[index];

        if ( (!target || target.classList.contains('active-current')) ) {
          return;
        }

        document.querySelectorAll('.post-toc .active').forEach(element => {
          element.classList.remove('active', 'active-current');
        });
        target.classList.add('active', 'active-current');
        // Scrolling to center active TOC element if TOC content is taller then viewport.
        const tocElement = document.querySelector('.post-toc-wrap');
        window.anime({
          targets: tocElement,
          duration: 200,
          easing: 'linear',
          scrollTop: tocElement.scrollTop - (tocElement.offsetHeight / 2) + target.getBoundingClientRect().top - tocElement.getBoundingClientRect().top
        });
      },

      showTOCAside() {

        const openHandle = () => {
          const styleStatus = Global.getStyleStatus();
          const key = 'isOpenPageAside';
          if (styleStatus && styleStatus.hasOwnProperty(key)) {
            Global.utils.TocToggle.pageAsideHandleOfTOC(styleStatus[key]);
          } else {
            Global.utils.TocToggle.pageAsideHandleOfTOC(true);
          }
        }

        const initOpenKey = 'init_open';

        if (Global.theme_config.articles.toc.hasOwnProperty(initOpenKey)) {
          Global.theme_config.articles.toc[initOpenKey] ? openHandle() : Global.utils.TocToggle.pageAsideHandleOfTOC(false);

        } else {
          openHandle();
        }

      }
    }

    Global.utils.showTOCAside();
    Global.utils.registerTOCScroll();

  } else {
    document.querySelectorAll('.toc-content-container, .toc-marker').forEach((elem) => {
      elem.remove();
    });
  }
}

if (Global.theme_config.global.pjax === true && Global.utils) {
  initTOC();
} else {
  window.addEventListener('DOMContentLoaded', initTOC);
}
