"use client";
import Link from "next/link";
import styles from "./home.module.css";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Feature, Features } from "@/app/[lang]/(home)/features";
import { cn } from "@/lib/cn";
import { ArrowRight } from "lucide-react";

export default function EnIndex() {
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);

  useEffect(() => {
    const styleSheets = document.styleSheets;
    const checkStyles = () => {
      if (styleSheets.length > 0) {
        setIsStylesLoaded(true);
      }
    };
    checkStyles();
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
              Build Your Perfect Blog <br className="sm:inline hidden" />
              with Hexo & R<span style={{ color: "#A31F34" }}>e</span>
              define
            </h1>
            <p className="subtitle">
              A Hexo theme that is <strong>elegant</strong>,{" "}
              <strong>performant</strong>, and <strong>refined</strong>.
              <br className="sm:block hidden" />
              Minimalist, but <strong>feature-rich</strong>.
            </p>
            <p className="subtitle">
              <Link className={cn("flex flex-row items-center gap-1 rounded-full px-6 py-4 bg-fd-primary text-white w-fit shadow-md shadow-fd-primary/20 hover:shadow-lg hover:shadow-fd-primary/30 group transition-all duration-300")} href="/getting-started" >
                <span>Get Started</span> <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-all duration-300" />
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
                    src="https://assets.ohevan.com/img/d30e1ba5c890baccb81abe773a701335.webp"
                    alt="Background"
                    loading="eager"
                    width={3240}
                    height={2064}
                  />
                  <Image
                    src="https://assets.ohevan.com/img/725dd6b1399419307764034c0e2f890e.webp"
                    alt="Background (Dark)"
                    loading="eager"
                    width={3240}
                    height={2064}
                  />
                  <h3>
                    Set up your blog in minutes
                    <br className="show-on-mobile" />
                    with minimal configuration
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
                      Resource Compression <br className="show-on-mobile" />
                      <span style={{ fontWeight: 300 }}>Supported</span>
                    </h3>
                    <p className="text-left mb-8">
                      After installing the
                      <Link
                        href="https://www.npmjs.com/package/hexo-all-minifier"
                        className="mx-1"
                      >
                        <code>hexo-all-minifier</code>
                      </Link>
                      plugin, you can significantly speed up page load times,
                      <br className="show-on-mobile" />
                      optimizing SEO and user experience.
                    </p>
                    <div>
                      <div className={styles.optimization}>
                        <div
                          style={{ fontSize: ".9rem" }}
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
                          style={{ fontSize: ".9rem" }}
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
                    Fully Supported
                  </h3>
                  <p className="mr-6">
                    After installing the{" "}
                    <code>hexo-filter-mermaid-diagrams</code> plugin, Mermaid JS
                    diagrams are perfectly supported.
                  </p>
                </Feature>

                <Feature index={3} href="/introduction">
                  <h3>
                    Built-in SEO optimization,
                    <br className="show-on-mobile" />
                    no extra work needed
                  </h3>
                  <p className="mb-4 mr-6">
                    Redefine comes with optimized SEO settings to help your site
                    rank better. Everything works out of the box.
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
                    Custom-designed Markdown styling
                    <br className="hide-medium" />
                    for enhanced readability
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
                    Dark <br />
                    mode <br />
                    included
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
                    Various writing modules
                    <br />
                    to make your articles
                    <br />
                    more diverse and rich.
                  </h3>
                </Feature>

                <Feature index={9} large>
                  <h3>And there's more</h3>
                  <p className="mr-6">
                    SEO / RSS Feed / APlayer / PJAX / Article Cover Images /
                    Font Awesome 6.2.1 Pro...
                    <br />
                    Discover all the features.
                  </p>
                  <p className="subtitle">
                    <Link className="!no-underline" href="/getting-started">
                      Get Started with Redefine →
                    </Link>
                  </p>
                </Feature>

                <Feature
                  index={10}
                  href="/posts/articles#%E6%96%87%E7%AB%A0%E6%8E%A8%E8%8D%90"
                >
                  <h3>
                    Smart <strong>Article Recommendations</strong>
                    <br />
                    built right in
                  </h3>
                  <p className="mr-6">
                    Install `nodejieba` to enable intelligent article
                    recommendations at the end of each post. The system
                    automatically suggests related content based on keywords,
                    powered by technology from `hexo-theme-volantis`.
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
