"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import { Feature, Features } from "@/app/[lang]/(home)/features";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export default function ZhIndex() {
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);

  useEffect(() => {
    // Check if styles are loaded
    const styleSheets = document.styleSheets;
    const checkStyles = () => {
      if (styleSheets.length > 0) {
        setIsStylesLoaded(true);
      }
    };

    checkStyles();
    // Fallback if styles load later
    window.addEventListener("load", checkStyles);

    return () => {
      window.removeEventListener("load", checkStyles);
    };
  }, []);

  return (
    <AnimatePresence>
      {isStylesLoaded ? (
        <motion.div
          className="home-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="content-container">
            <h1 className="headline">
              打造属于你的完美博客 <br className="sm:inline hidden" />
              Hexo & Redefine
            </h1>
            <p className="subtitle">
              一款<strong>优雅</strong>，<strong>高效</strong>，
              <strong>精致</strong>的 Hexo 主题
              <br className="sm:block hidden" />
              简约，但<strong>不简单</strong>。
            </p>
            <p className="subtitle">
              <Link className={cn("flex flex-row items-center gap-1 rounded-full px-6 py-4 bg-fd-primary text-white w-fit shadow-md shadow-fd-primary/20 hover:shadow-lg hover:shadow-fd-primary/30 group transition-all duration-300")} href="/getting-started" >
                <span>快速开始</span> <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-all duration-300" />
              </Link>
            </p>
          </div>

          <style jsx>{`
            .content-container {
              max-width: 90rem;
              padding-left: max(env(safe-area-inset-left), 1.5rem);
              padding-right: max(env(safe-area-inset-right), 1.5rem);
              margin: 0 auto;
            }

            .features-container {
              margin: 8rem 0 0;
              padding: 4rem 0;
            }

            .features-container .content-container {
              margin-top: -8rem;
            }

            .headline {
              display: inline-block;
              font-size: 3.125rem;
              font-size: min(4.375rem, max(8vw, 2.5rem));
              font-weight: 700;
              font-feature-settings: initial;
              letter-spacing: -0.12rem;
              margin-left: -0.2rem;
              margin-top: 3.4rem;
              line-height: 1.1;
              background-image: linear-gradient(146deg, #000, #757a7d);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            :global(.dark) .headline {
              background-image: linear-gradient(146deg, #fff, #757a7d);
            }

            .subtitle {
              font-size: 1.3rem;
              font-size: min(1.3rem, max(3.5vw, 1.2rem));
              font-feature-settings: initial;
              line-height: 1.7;
              margin-top: 1.5rem;
            }

            .nextjs-link {
              color: currentColor;
              text-decoration: none;
              font-weight: 600;
            }

            :global(#docs-card) {
              color: #fff;
              text-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
            }

            :global(#docs-card img) {
              object-fit: cover;
              object-position: left;
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              height: 100%;
              z-index: 0;
              user-select: none;
              pointer-events: none;
            }

            :global(#docs-card img:nth-child(2)) {
              display: none;
            }

            :global(.dark #docs-card img:nth-child(2)) {
              display: initial;
            }

            :global(.dark #docs-card img:nth-child(1)) {
              display: none;
            }

            :global(#highlighting-card) {
              min-height: 300px;
              background-image: linear-gradient(to top, transparent, #fff 50%),
                url(https://assets.ohevan.com/img/code-highlightings-12ydbawibo2.svg);
              background-size: 634px;
              background-position: -6px calc(100% + 4px);
              background-repeat: no-repeat;
            }

            :global(.dark #highlighting-card) {
              background-image: linear-gradient(
                  to top,
                  transparent,
                  #202020 50%
                ),
                url(https://assets.ohevan.com/img/code-highlightings-12ydbawibo2.svg);
            }

            :global(.feat-darkmode) {
              min-height: 300px;
            }

            :global(.feat-darkmode h3) {
              font-size: 48px;
            }

            :global(#search-card) {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            :global(#search-card p) {
              max-width: 320px;
            }

            :global(#search-card video) {
              position: absolute;
              right: 0;
              top: 24px;
              height: 430px;
              pointer-events: none;
              max-width: 60%;
            }

            :global(#fs-card) {
              min-height: 240px;
            }

            :global(#fs-card h3) {
              text-align: left;
              width: min(300px, 41%);
              min-width: 155px;
            }

            @media screen and (max-width: 1300px) {
              :global(#a11y-card) {
                background-image: linear-gradient(to bottom, white, transparent),
                  url(/assets/high-contrast.png);
              }
            }

            @media screen and (max-width: 1200px) {
              :global(#highlighting-card) {
                aspect-ratio: auto;
              }

              :global(.feat-darkmode h3) {
                font-size: 4vw;
                font-size: min(48px, max(4vw, 30px));
              }

              :global(#search-card video) {
                aspect-ratio: 787 / 623;
                height: auto;
              }

              .headline {
                letter-spacing: -0.08rem;
              }
            }

            @media screen and (max-width: 1024px) {
              :global(#docs-card) {
                aspect-ratio: 135 / 86;
              }

              :global(#search-card) {
                aspect-ratio: 8 / 3;
              }

              :global(#search-card h3) {
                text-align: left;
              }

              :global(#highlighting-card) {
                background-size: 136%;
              }

              :global(#a11y-card) {
                background-image: url(/assets/high-contrast.png);
                background-position: center 160px;
              }
            }

            @media screen and (max-width: 768px) {
              :global(#docs-card) {
                min-height: 348px;
                width: 100%;
                aspect-ratio: auto;
              }

              :global(#docs-card img) {
                object-position: -26px 0;
                width: 250%;
                max-width: initial;
              }
            }

            @media screen and (max-width: 640px) {
              :global(#search-card) {
                aspect-ratio: 2.5 / 2;
                justify-content: flex-start;
                align-items: stretch;
                min-height: 350px;
              }

              :global(#search-card h3) {
                text-align: center;
              }

              :global(#search-card p) {
                max-width: 100%;
              }

              :global(#search-card video) {
                position: relative;
                margin: 0.75em -1.75em 0;
                max-width: calc(100% + 3.5em);
              }

              :global(.dark #search-card video) {
                mix-blend-mode: lighten;
              }
            }

            /* Additional Styles */
            .rotate-90 {
              transform: rotate(90deg);
              margin: 0 auto;
            }

            .my-6 {
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
            }

            .mb-8 {
              margin-bottom: 2rem;
              margin-top: 2rem;
            }

            .leading-8 {
              padding: 1.5rem;
            }

            #highlighting-card p {
              margin-top: 1.5rem;
            }

            .mr-6 {
              margin-top: 1.5rem;
            }
          `}</style>

          <div className="features-container">
            <div className="content-container">
              <Features>
                <Feature
                  index={0}
                  large
                  centered
                  id="docs-card"
                  href="/introduction"
                >
                  <Image
                    src={
                      "https://assets.ohevan.com/img/d30e1ba5c890baccb81abe773a701335.webp"
                    }
                    alt="Background"
                    loading="eager"
                    width={3240}
                    height={2064}
                  />
                  <Image
                    src={
                      "https://assets.ohevan.com/img/725dd6b1399419307764034c0e2f890e.webp"
                    }
                    alt="Background (Dark)"
                    loading="eager"
                    width={3240}
                    height={2064}
                  />
                  <h3>
                    轻松搭建博客 <span className={"hidden sm:inline"}>，</span>
                    <br className="show-on-mobile" />
                    配置毫不繁琐。
                  </h3>
                </Feature>

                <Feature
                  index={1}
                  centered
                  className="card-with-border"
                  href="/plugins/all_minifier"
                >
                  <div className="h-full flex flex-col justify-between">
                    <h3>
                      资源压缩 <br className="show-on-mobile" />
                      <span style={{ fontWeight: 300 }}>支持</span>
                    </h3>
                    <p className="text-left mb-8">
                      在安装
                      <Link
                        href="https://www.npmjs.com/package/hexo-all-minifier"
                        className="mx-1"
                      >
                        <code>hexo-all-minifier</code>
                      </Link>
                      插件后，有效加快页面访问速度，
                      <br className="show-on-mobile" />
                      优化 SEO 以及访问体验。
                    </p>
                    <div>
                      <div className={styles.optimization}>
                        <div
                          style={{
                            fontSize: ".9rem",
                          }}
                          className="leading-8"
                        >
                          <code>5.21mb</code>
                          <br />
                          <code>loading time 5s</code>
                        </div>
                      </div>
                      <div className="flex justify-center text-neutral-400 my-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="rotate-90"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className={styles.optimization}>
                        <div
                          style={{
                            fontSize: ".9rem",
                          }}
                          className="leading-8"
                        >
                          <code>- 3.17mb</code>
                          <br />
                          <code>loading time &lt;1s</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </Feature>

                <Feature
                  index={2}
                  id="highlighting-card"
                  href="/plugins/mermaid"
                >
                  <h3>
                    Mermaid JS <br />
                    完美支持
                  </h3>
                  <p className="mr-6">
                    安装 <code>hexo-filter-mermaid-diagrams</code>{" "}
                    插件后，能完美支持 Mermaid JS 流程图显示。
                  </p>
                </Feature>

                <Feature index={3} href="/introduction">
                  <h3>
                    内置 SEO 优化，
                    <br className="show-on-mobile" />
                    请坐和放宽。
                  </h3>
                  <p className="mb-4 mr-6">
                    Redefine 主题经过许多 SEO
                    优化，让你的网站更快被搜索引擎收录。 无需繁琐配置。
                  </p>
                </Feature>

                <Feature
                  index={4}
                  centered
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage:
                      "url(https://assets.ohevan.com/img/c522a2888a3be798c1019a625aa122df.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "#fff",
                  }}
                  href="/introduction"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="208"
                    height="128"
                    viewBox="0 0 208 128"
                  >
                    <rect
                      width="198"
                      height="118"
                      x="5"
                      y="5"
                      ry="10"
                      stroke="none"
                      strokeWidth="10"
                      fill="none"
                    />
                    <path
                      fill="white"
                      d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"
                    />
                  </svg>
                  <p
                    className="mr-6"
                    style={{
                      textShadow: "0 2px 4px rgb(0 0 0 / 20%)",
                    }}
                  >
                    经过特别设计的 Markdown 文章内容样式，
                    <br className="hide-medium" />
                    让阅读变得，简单明了。
                  </p>
                </Feature>

                <Feature
                  index={5}
                  centered
                  className="feat-darkmode"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    animate={{
                      backgroundPosition: [
                        "0% 0%",
                        "50% 40%",
                        "50% 40%",
                        "100% 100%",
                      ],
                      backgroundImage: [
                        "radial-gradient(farthest-corner, #e2e5ea, #e2e5ea)",
                        "radial-gradient(farthest-corner, #06080a, #e2e5ea)",
                        "radial-gradient(farthest-corner, #06080a, #e2e5ea)",
                        "radial-gradient(farthest-corner, #e2e5ea, #e2e5ea)",
                      ],
                    }}
                    transition={{
                      backgroundPosition: {
                        times: [0, 0.5, 0.5, 1],
                        repeat: Infinity,
                        duration: 10,
                        delay: 1,
                      },
                      backgroundImage: {
                        times: [0, 0.2, 0.8, 1],
                        repeat: Infinity,
                        duration: 10,
                        delay: 1,
                      },
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundImage:
                        "radial-gradient(farthest-corner, #06080a, #e2e5ea)",
                      backgroundSize: "400% 400%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <motion.h3
                    animate={{
                      color: ["#dae5ff", "#fff", "#fff", "#dae5ff"],
                    }}
                    transition={{
                      color: {
                        times: [0.25, 0.35, 0.7, 0.8],
                        repeat: Infinity,
                        duration: 10,
                        delay: 1,
                      },
                    }}
                    style={{
                      position: "relative",
                      mixBlendMode: "difference",
                    }}
                  >
                    夜间 <br />
                    模式 <br />
                    支持
                  </motion.h3>
                </Feature>

                <Feature
                  index={7}
                  large
                  id="fs-card"
                  style={{
                    color: "white",
                    backgroundImage:
                      "url(https://assets.ohevan.com/img/80abd3f056d542af1d55380184b31cad.webp), url(https://assets.ohevan.com/img/c522a2888a3be798c1019a625aa122df.jpg)",
                    backgroundSize: "140%, 180%",
                    backgroundPosition: "130px -8px, top",
                    backgroundRepeat: "no-repeat",
                    textShadow: "0 1px 6px rgb(38 59 82 / 18%)",
                    aspectRatio: "1.765",
                  }}
                  href="/modules"
                >
                  <h3>
                    多种写作模块，
                    <br />
                    让你的文章更加，
                    <br />
                    丰富多样。
                  </h3>
                </Feature>

                <Feature index={9} large>
                  <h3>以及更多</h3>
                  <p className="mr-6">
                    SEO / RSS Feed / Aplayer 播放器 / PJAX / 文章头图 / Font
                    Awesome 6.2.1 Pro...
                    <br />
                    更多功能有待探索。
                  </p>
                  <p className="subtitle">
                    <Link className="!no-underline" href="/getting-started">
                      开始使用 Redefine →
                    </Link>
                  </p>
                </Feature>

                <Feature
                  index={10}
                  href="/posts/articles#%E6%96%87%E7%AB%A0%E6%8E%A8%E8%8D%90"
                >
                  <h3>
                    掌握<strong>文章推荐</strong>
                    <br />
                    的魔法。
                  </h3>
                  <p className="mr-6">
                    在安装 `nodejieba`
                    以后，文章底部会出现推荐文章，自动根据每个
                    文章关键词进行推荐。迁移自 `hexo-theme-volantis`。
                  </p>
                </Feature>
              </Features>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="min-h-svh w-full"></div>
      )}
    </AnimatePresence>
  );
}
