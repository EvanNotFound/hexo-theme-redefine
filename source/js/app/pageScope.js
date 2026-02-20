let appController = null;
let pageController = null;

export const getAppSignal = () => {
  if (!appController) {
    appController = new AbortController();
  }

  return appController.signal;
};

export const createPageScope = () => {
  if (pageController) {
    pageController.abort();
  }

  pageController = new AbortController();
  return pageController.signal;
};

export const abortPageScope = () => {
  if (!pageController) {
    return;
  }

  pageController.abort();
  pageController = null;
};
