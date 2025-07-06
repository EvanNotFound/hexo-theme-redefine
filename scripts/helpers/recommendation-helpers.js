/*
 * Optimized by: EvanNotFound
 */

const articleLibrary = [];
const corpus = [];
let flag = null;

hexo.extend.filter.register("template_locals", function (localVariables) {
  const cfg = hexo.theme.config.articles.recommendation;
  if (!cfg.enable) {
    return localVariables;
  }
  if (!flag) {
    flag = 1;
    fetchData(localVariables.site.posts, cfg);
    fetchData(localVariables.site.pages, cfg);
    articleRecommendation(cfg);
  }
  return localVariables;
});

function fetchData(s, cfg) {
  s.each(function (p) {
    if (["post", "docs"].includes(p.layout)) {
      articleLibrary.push({
        path: p.path,
        title: p.title || p.seo_title || p.short_title,
        headimg: p.thumbnail || p.banner || p.cover || cfg.placeholder,
      });
      corpus.push(tokenize(p.raw));
    }
  });
}

function cleanData(data) {
  const symbolLists = [
    ",",
    ".",
    "?",
    "!",
    ":",
    ";",
    "、",
    "……",
    "~",
    "&",
    "@",
    "#",
    "，",
    "。",
    "？",
    "！",
    "：",
    "；",
    "·",
    "…",
    "～",
    "＆",
    "＠",
    "＃",
    "“",
    "”",
    "‘",
    "’",
    "〝",
    "〞",
    '"',
    "'",
    "＂",
    "＇",
    "´",
    "＇",
    "(",
    ")",
    "【",
    "】",
    "《",
    "》",
    "＜",
    "＞",
    "﹝",
    "﹞",
    "<",
    ">",
    "(",
    ")",
    "[",
    "]",
    "«",
    "»",
    "‹",
    "›",
    "〔",
    "〕",
    "〈",
    "〉",
    "{",
    "}",
    "［",
    "］",
    "「",
    "」",
    "｛",
    "｝",
    "〖",
    "〗",
    "『",
    "』",
    "︵",
    "︷",
    "︹",
    "︿",
    "︽",
    "﹁",
    "﹃",
    "︻",
    "︗",
    "/",
    "|",
    "\\",
    "︶",
    "︸",
    "︺",
    "﹀",
    "︾",
    "﹂",
    "﹄",
    "﹄",
    "︼",
    "︘",
    "／",
    "｜",
    "＼",
    "_",
    "¯",
    "＿",
    "￣",
    "﹏",
    "﹋",
    "﹍",
    "﹉",
    "﹎",
    "﹊",
    "`",
    "ˋ",
    "¦",
    "︴",
    "¡",
    "¿",
    "^",
    "ˇ",
    "­",
    "¨",
    "ˊ",
    " ",
    "　",
    "%",
    "*",
    "-",
    "+",
    "=",
    "￥",
    "$",
    "（",
    "）",
  ];
  data = data.replace(/\s/g, " ");
  data = data.replace(/\!\[(.*?)\]\(.*?\)/g, (_a, b) => {
    return b;
  });
  data = data.replace(
    /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g,
    " ",
  );
  for (const symbol of symbolLists) {
    data = data.replace(new RegExp("\\" + symbol, "g"), " ");
  }
  data = data.replace(/\d+/g, " ");
  data = data.replace(/\s/g, " ");
  return data;
}

function tokenize(data) {
  const jieba = require("nodejieba");
  return jieba
    .cut(cleanData(data), true)
    .filter((word) => word !== " " && !/^[0-9]*$/.test(word));
}

function cosineSimilarity(vector1, vector2) {
  let numerator = 0;
  let sqrt1 = 0;
  let sqrt2 = 0;
  if (vector1.length == vector2.length) {
    for (let i = 0; i < vector1.length; i++) {
      numerator += vector1[i] * vector2[i];
      sqrt1 += vector1[i] * vector1[i];
      sqrt2 += vector2[i] * vector2[i];
    }
    return numerator / (Math.sqrt(sqrt1) * Math.sqrt(sqrt2));
  }
}

function createWordLibrary(allWords) {
  const wordLibrary = {};
  allWords.forEach((word) => {
    wordLibrary[word] = 0;
  });
  return wordLibrary;
}

function calculateWordFrequency(wordLibrary, wordsInArticle) {
  const wordOccurrenceLibrary = wordsInArticle.reduce(
    (wordCountObj, wordName) => {
      if (wordName in wordCountObj) {
        wordCountObj[wordName]++;
      }
      return wordCountObj;
    },
    JSON.parse(JSON.stringify(wordLibrary)),
  );

  const wordFrequency = JSON.parse(JSON.stringify(wordLibrary));
  for (const word of Object.keys(wordLibrary)) {
    wordFrequency[word] = wordOccurrenceLibrary[word] / wordsInArticle.length;
  }
  return wordFrequency;
}

function articleRecommendation(cfg) {
  const dataSet = {};
  const similaritySet = {};
  const recommendationSet = {};
  let allWordsInAllArticles = [];

  for (const wordList of corpus) {
    allWordsInAllArticles = [
      ...new Set(allWordsInAllArticles.concat(wordList)),
    ];
  }

  const wordLibrary = createWordLibrary(allWordsInAllArticles);
  const documentCountLibrary = JSON.parse(JSON.stringify(wordLibrary));

  for (let i = 0; i < corpus.length; i++) {
    const articlePath = articleLibrary[i].path;
    const wordsInArticle = corpus[i];

    const wordFrequency = calculateWordFrequency(wordLibrary, wordsInArticle);
    dataSet[articlePath] = { wordFrequency };

    for (const word of Object.keys(wordLibrary)) {
      if (wordFrequency[word]) {
        documentCountLibrary[word]++;
      }
    }
  }

  for (let i = 0; i < corpus.length; i++) {
    const articlePath = articleLibrary[i].path;
    dataSet[articlePath]["inverseDocumentFrequency"] = JSON.parse(
      JSON.stringify(wordLibrary),
    );
    dataSet[articlePath]["wordFrequency-inverseDocumentFrequency"] = JSON.parse(
      JSON.stringify(wordLibrary),
    );
    dataSet[articlePath]["wordFrequencyVector"] = [];
    for (const word of Object.keys(wordLibrary)) {
      const inverseDocumentFrequency = Math.log(
        corpus.length / (documentCountLibrary[word] + 1),
      );
      const wordFrequencyInverseDocumentFrequency =
        dataSet[articlePath]["wordFrequency"][word] * inverseDocumentFrequency;
      dataSet[articlePath]["wordFrequencyVector"].push(
        wordFrequencyInverseDocumentFrequency,
      );
    }
  }

  for (let i = 0; i < corpus.length; i++) {
    const articlePath1 = articleLibrary[i].path;
    similaritySet[articlePath1] = {};
    for (let j = 0; j < corpus.length; j++) {
      const articlePath2 = articleLibrary[j].path;
      similaritySet[articlePath1][articlePath2] = cosineSimilarity(
        dataSet[articlePath1]["wordFrequencyVector"],
        dataSet[articlePath2]["wordFrequencyVector"],
      );
    }
    for (let j = 0; j < corpus.length; j++) {
      recommendationSet[articlePath1] = Object.keys(
        similaritySet[articlePath1],
      ).sort(function (a, b) {
        return similaritySet[articlePath1][b] - similaritySet[articlePath1][a]; // Descending order
      });
    }
    const index = recommendationSet[articlePath1].indexOf(articlePath1);
    if (index > -1) {
      recommendationSet[articlePath1].splice(index, 1);
    }
    recommendationSet[articlePath1] = recommendationSet[articlePath1].slice(
      0,
      cfg.limit,
    );
    for (let j = 0; j < recommendationSet[articlePath1].length; j++) {
      const e = recommendationSet[articlePath1][j];
      recommendationSet[articlePath1][j] = articleLibrary.filter(
        (w) => w.path == e,
      )[0];
    }
  }
  hexo.locals.set("recommendationSet", function () {
    return recommendationSet;
  });
}

hexo.extend.helper.register("articleRecommendationGenerator", function (post) {
  if (!post) return "";
  const cfg = hexo.theme.config.articles.recommendation;
  if (!cfg.enable) {
    return "";
  }
  for (const dir of cfg.skip_dirs) {
    if (new RegExp("^" + dir, "g").test(post.path)) {
      return "";
    }
  }
  const recommendationSet = hexo.locals.get("recommendationSet");
  const recommendedArticles = recommendationSet[post.path];
  return userInterface(recommendedArticles, cfg);
});

function userInterface(recommendedArticles, cfg) {
  let html = "";
  let htmlMobile = "";
  for (const item of recommendedArticles) {
    html += itemInterface(item);
  }
  for (const itemMobile of recommendedArticles.slice(0, cfg.mobile_limit)) {
    htmlMobile += itemInterface(itemMobile);
  }
  return `
  <div class="recommended-article px-2 sm:px-6 md:px-8">
   <div class="recommended-desktop">
    <div class="recommended-article-header text-xl md:text-3xl font-bold mt-10">
     <i aria-hidden="true"></i><span>${cfg.title}</span>
    </div>
    <div class="recommended-article-group">${html}</div>
   </div>
   <div class="recommended-mobile">
   <div class="recommended-article-header text-xl md:text-3xl font-bold mt-10">
     <i aria-hidden="true"></i><span>${cfg.title}</span>
   </div>
   <div class="recommended-article-group">${htmlMobile}</div>
   </div>
  </div>`;
}

function itemInterface(item) {
  const url = hexo.extend.helper.get('url_for').call(hexo, item.path);
  return `<a class="recommended-article-item" href="${url}" title="${item.title}" rel="bookmark">
  <img src="${item.headimg}" alt="${item.title}" class="!max-w-none">
  <span class="title">${item.title}</span>
</a>`;
}
