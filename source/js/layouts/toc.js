/* global REDEFINE */
function initTOC() {
  REDEFINE.utils.navItems = document.querySelectorAll('.post-toc-wrap .post-toc li');

  if (REDEFINE.utils.navItems.length > 0) {

    REDEFINE.utils = {

      ...REDEFINE.utils,

      updateActiveTOCLink() {
        if (!Array.isArray(REDEFINE.utils.sections)) return;
        let index = REDEFINE.utils.sections.findIndex(element => {
          return element && element.getBoundingClientRect().top - 200 > 0;
        });
        if (index === -1) {
          index = REDEFINE.utils.sections.length - 1;
        } else if (index > 0) {
          index--;
        }
        this.activateTOCLink(index);
      },

      registerTOCScroll() {
        REDEFINE.utils.sections = [...document.querySelectorAll('.post-toc li a.nav-link')].map(element => {
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
                  REDEFINE.utils.pageTop_dom.classList.add('hide');
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
          const styleStatus = REDEFINE.getStyleStatus();
          const key = 'isOpenPageAside';
          if (styleStatus && styleStatus.hasOwnProperty(key)) {
            REDEFINE.utils.TocToggle.pageAsideHandleOfTOC(styleStatus[key]);
          } else {
            REDEFINE.utils.TocToggle.pageAsideHandleOfTOC(true);
          }
        }

        const initOpenKey = 'init_open';

        if (REDEFINE.theme_config.toc.hasOwnProperty(initOpenKey)) {
          REDEFINE.theme_config.toc[initOpenKey] ? openHandle() : REDEFINE.utils.TocToggle.pageAsideHandleOfTOC(false);

        } else {
          openHandle();
        }

      }
    }

    REDEFINE.utils.showTOCAside();
    REDEFINE.utils.registerTOCScroll();

  } else {
    REDEFINE.utils.pageContainer_dom.removeChild(document.querySelector('.toc-content-container'));
    REDEFINE.utils.pageContainer_dom.removeChild(document.querySelector('.toc-marker'));
  }
}

if (REDEFINE.theme_config.pjax.enable === true && REDEFINE.utils) {
  initTOC();
} else {
  window.addEventListener('DOMContentLoaded', initTOC);
}
