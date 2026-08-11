let isFetched = false;
let cachedData = [];
let cachedPath = null;
let isXml = true;
let didInit = false;
let warnedMissing = false;
let activeSearchTrigger = null;

const resolveSearchPath = () => {
  const configPath = config.path;
  if (!configPath) {
    return null;
  }

  let searchPath = configPath;
  isXml = true;

  if (searchPath.length === 0) {
    searchPath = "search.xml";
  } else if (searchPath.endsWith("json")) {
    isXml = false;
  }

  cachedPath = searchPath;
  return searchPath;
};

const ensureSearchPath = () => cachedPath || resolveSearchPath();

const normalizeData = (rawData) => {
  return rawData
    .filter((data) => data.title)
    .map((data) => {
      data.title = data.title.trim();
      data.content = data.content
        ? data.content.trim().replace(/<[^>]+>/g, "")
        : "";
      data.url = decodeURIComponent(data.url).replace(/\/{2,}/g, "/");
      return data;
    });
};

const fetchData = () => {
  if (isFetched || !cachedPath) {
    return;
  }

  fetch(config.root + cachedPath)
    .then((response) => response.text())
    .then((res) => {
      isFetched = true;
      cachedData = isXml
        ? [
            ...new DOMParser()
              .parseFromString(res, "text/xml")
              .querySelectorAll("entry"),
          ].map((element) => {
            return {
              title: element.querySelector("title").textContent,
              content: element.querySelector("content").textContent,
              url: element.querySelector("url").textContent,
            };
          })
        : JSON.parse(res);

      cachedData = normalizeData(cachedData);
      const noResultDom = document.getElementById("local-search-status");
      if (noResultDom) {
        noResultDom.innerHTML =
          '<i class="fa-solid fa-magnifying-glass fa-5x"></i>';
      }
    })
    .catch((error) => {
      console.error("Failed to load search data:", error);
    });
};

const getSearchDom = () => ({
  searchInputDom: document.getElementById("local-search-input"),
  resultContent: document.getElementById("local-search-results"),
  dialog: document.getElementById("local-search"),
});

const closePopup = () => {
  const { dialog } = getSearchDom();
  if (!dialog) {
    return;
  }

  document.body.style.overflow = "";
  if (dialog.open) {
    dialog.close();
  }
  activeSearchTrigger?.focus();
  activeSearchTrigger = null;
};

const openPopup = (trigger) => {
  const { dialog, searchInputDom } = getSearchDom();
  if (!dialog || !searchInputDom) {
    return;
  }

  activeSearchTrigger = trigger;
  document.body.style.overflow = "hidden";
  if (!dialog.open) {
    dialog.showModal();
  }
  setTimeout(() => searchInputDom.focus(), 300);
  if (!isFetched) {
    fetchData();
  }
};

const getIndexByWord = (word, text, caseSensitive) => {
  const wordLen = word.length;
  if (wordLen === 0) return [];
  let startPosition = 0;
  let position = [];
  const index = [];
  if (!caseSensitive) {
    text = text.toLowerCase();
    word = word.toLowerCase();
  }
  while ((position = text.indexOf(word, startPosition)) > -1) {
    index.push({ position, word });
    startPosition = position + wordLen;
  }
  return index;
};

const mergeIntoSlice = (start, end, index, searchText) => {
  let currentItem = index[index.length - 1];
  let { position, word } = currentItem;
  const hits = [];
  let searchTextCountInSlice = 0;

  while (position + word.length <= end && index.length !== 0) {
    if (word === searchText) {
      searchTextCountInSlice++;
    }
    hits.push({
      position,
      length: word.length,
    });

    const wordEnd = position + word.length;
    index.pop();
    for (let i = index.length - 1; i >= 0; i--) {
      currentItem = index[i];
      position = currentItem.position;
      word = currentItem.word;
      if (wordEnd <= position) {
        break;
      } else {
        index.pop();
      }
    }
  }

  return {
    hits,
    start,
    end,
    searchTextCount: searchTextCountInSlice,
  };
};

const highlightKeyword = (text, slice) => {
  let result = "";
  let prevEnd = slice.start;
  slice.hits.forEach((hit) => {
    result += text.substring(prevEnd, hit.position);
    const end = hit.position + hit.length;
    result += `<b class="border-b border-dashed border-primary font-bold text-primary">${text.substring(
      hit.position,
      end,
    )}</b>`;
    prevEnd = end;
  });
  result += text.substring(prevEnd, slice.end);
  return result;
};

const renderSearchResult = (searchInputDom) => {
  if (!isFetched || !searchInputDom) {
    return;
  }

  const { resultContent } = getSearchDom();
  if (!resultContent) {
    return;
  }

  const searchText = searchInputDom.value.trim().toLowerCase();
  const keywords = searchText.split(/[-\s]+/);
  if (keywords.length > 1) {
    keywords.push(searchText);
  }
  const resultItems = [];

  if (searchText.length > 0) {
    cachedData.forEach(({ title, content, url }) => {
      const titleInLowerCase = title.toLowerCase();
      const contentInLowerCase = content.toLowerCase();
      let indexOfTitle = [];
      let indexOfContent = [];
      let searchTextCount = 0;

      keywords.forEach((keyword) => {
        indexOfTitle = indexOfTitle.concat(
          getIndexByWord(keyword, titleInLowerCase, false),
        );
        indexOfContent = indexOfContent.concat(
          getIndexByWord(keyword, contentInLowerCase, false),
        );
      });

      if (indexOfTitle.length > 0 || indexOfContent.length > 0) {
        const hitCount = indexOfTitle.length + indexOfContent.length;
        [indexOfTitle, indexOfContent].forEach((index) => {
          index.sort((itemLeft, itemRight) => {
            if (itemRight.position !== itemLeft.position) {
              return itemRight.position - itemLeft.position;
            }
            return itemLeft.word.length - itemRight.word.length;
          });
        });

        const slicesOfTitle = [];
        if (indexOfTitle.length !== 0) {
          const tmp = mergeIntoSlice(0, title.length, indexOfTitle, searchText);
          searchTextCount += tmp.searchTextCountInSlice;
          slicesOfTitle.push(tmp);
        }

        let slicesOfContent = [];
        while (indexOfContent.length !== 0) {
          const item = indexOfContent[indexOfContent.length - 1];
          const { position, word } = item;
          let start = position - 20;
          let end = position + 80;
          if (start < 0) {
            start = 0;
          }
          if (end < position + word.length) {
            end = position + word.length;
          }
          if (end > content.length) {
            end = content.length;
          }
          const tmp = mergeIntoSlice(start, end, indexOfContent, searchText);
          searchTextCount += tmp.searchTextCountInSlice;
          slicesOfContent.push(tmp);
        }

        slicesOfContent.sort((sliceLeft, sliceRight) => {
          if (sliceLeft.searchTextCount !== sliceRight.searchTextCount) {
            return sliceRight.searchTextCount - sliceLeft.searchTextCount;
          } else if (sliceLeft.hits.length !== sliceRight.hits.length) {
            return sliceRight.hits.length - sliceLeft.hits.length;
          }
          return sliceLeft.start - sliceRight.start;
        });

        const upperBound = parseInt(
          theme.navbar.search.top_n_per_article
            ? theme.navbar.search.top_n_per_article
            : 1,
          10,
        );
        if (upperBound >= 0) {
          slicesOfContent = slicesOfContent.slice(0, upperBound);
        }

        let resultItem = "";

        if (slicesOfTitle.length !== 0) {
          resultItem += `<li class="my-2.5 box-border border-b border-dashed border-rd-gray-alpha-400 py-2.5 last:border-b-0"><a href="${url}" class="mb-2.5 flex items-center font-bold"><span class="mr-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-rd-gray-1000" aria-hidden="true"></span>${highlightKeyword(
            title,
            slicesOfTitle[0],
          )}</a>`;
        } else {
          resultItem += `<li class="my-2.5 box-border border-b border-dashed border-rd-gray-alpha-400 py-2.5 last:border-b-0"><a href="${url}" class="mb-2.5 flex items-center font-bold"><span class="mr-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-rd-gray-1000" aria-hidden="true"></span>${title}</a>`;
        }

        slicesOfContent.forEach((slice) => {
          resultItem += `<a href="${url}" class="hover:text-rd-gray-1000"><p class="m-0 pl-4 leading-8 [overflow-wrap:break-word]">${highlightKeyword(
            content,
            slice,
          )}...</p></a>`;
        });

        resultItem += "</li>";
        resultItems.push({
          item: resultItem,
          id: resultItems.length,
          hitCount,
          searchTextCount,
        });
      }
    });
  }

  if (keywords.length === 1 && keywords[0] === "") {
    resultContent.innerHTML =
      '<div id="local-search-status" class="m-auto text-rd-gray-900" aria-live="polite"><i class="fa-solid fa-magnifying-glass fa-5x" aria-hidden="true"></i></div>';
  } else if (resultItems.length === 0) {
    resultContent.innerHTML =
      '<div id="local-search-status" class="m-auto text-rd-gray-900" aria-live="polite"><i class="fa-solid fa-box-open fa-5x" aria-hidden="true"></i></div>';
  } else {
    resultItems.sort((resultLeft, resultRight) => {
      if (resultLeft.searchTextCount !== resultRight.searchTextCount) {
        return resultRight.searchTextCount - resultLeft.searchTextCount;
      } else if (resultLeft.hitCount !== resultRight.hitCount) {
        return resultRight.hitCount - resultLeft.hitCount;
      }
      return resultRight.id - resultLeft.id;
    });
    let searchResultList = '<ul class="h-full w-full text-base">';
    resultItems.forEach((result) => {
      searchResultList += result.item;
    });
    searchResultList += "</ul>";
    resultContent.innerHTML = searchResultList;
    window.pjax && window.pjax.refresh(resultContent);
  }
};

const handleInput = (event) => {
  if (!event.target.matches("#local-search-input")) {
    return;
  }

  renderSearchResult(event.target);
};

const handleClick = (event) => {
  const trigger = event.target.closest("[data-search-trigger]");
  if (trigger) {
    openPopup(trigger);
    return;
  }

  const dialog = event.target.closest("#local-search");
  if (dialog && event.target === dialog) {
    closePopup();
    return;
  }

  if (event.target.closest('[data-search-action="clear"]')) {
    const { searchInputDom } = getSearchDom();
    if (searchInputDom) {
      searchInputDom.value = "";
      searchInputDom.focus();
      renderSearchResult(searchInputDom);
    }
    return;
  }

  if (event.target.closest('[data-search-action="close"]')) {
    closePopup();
  }
};

const handleKeyup = (event) => {
  if (event.key === "Escape") {
    closePopup();
  }
};

export const initLocalSearchGlobals = ({ signal } = {}) => {
  const searchPath = ensureSearchPath();
  if (!searchPath) {
    if (!warnedMissing) {
      console.warn("`hexo-generator-searchdb` plugin is not installed!");
      warnedMissing = true;
    }
    return;
  }

  if (didInit) {
    return;
  }

  didInit = true;
  if (signal) {
    document.addEventListener("input", handleInput, { signal });
    document.addEventListener("click", handleClick, { signal });
    window.addEventListener("keyup", handleKeyup, { signal });
  } else {
    document.addEventListener("input", handleInput);
    document.addEventListener("click", handleClick);
    window.addEventListener("keyup", handleKeyup);
  }
};

export const initLocalSearchPage = () => {
  const searchPath = ensureSearchPath();
  if (!searchPath) {
    if (!warnedMissing) {
      console.warn("`hexo-generator-searchdb` plugin is not installed!");
      warnedMissing = true;
    }
    return;
  }

  closePopup();

  if (theme.navbar?.search?.preload) {
    fetchData();
  }
};
