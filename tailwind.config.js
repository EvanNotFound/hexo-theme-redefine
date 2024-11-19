/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["source/**/*.js", "layout/**/*.ejs", "scripts/**/*.js"],
  safelist: ["justify-center", "flex-row-reverse", "flex-row"],
  theme: {
    extend: {
      spacing: {
        unit: "38px",
      },
      margin: {
        "spacing-unit": "38px",
      },
      maxWidth: {
        content: "1000px", // You might want to adjust this value based on your use case
        "has-toc-content": "120%",
      },
      zIndex: {
        1: 1001,
        2: 1002,
        3: 1003,
        4: 1004,
        5: 1005,
        6: 1006,
        7: 1007,
        8: 1008,
        9: 1009,
      },
      borderRadius: {
        none: "0px",
        xsmall: "4px",
        small: "9px",
        medium: "14px",
        large: "18px",
        xlarge: "24px",
        xxlarge: "48px",
      },
      fontFamily: {
        // chinese: ["Noto Sans SC", "sans-serif"],
        english: ["Geist Variable", "sans-serif"],
        default: ["Geist Variable", "system-ui", "sans-serif"],
      },
      fontSize: {
        default: "16px", // You might want to adjust this value based on your use case
        // Add more font sizes if needed
      },
      lineHeight: {
        default: "1.5", // You might want to adjust this value based on your use case
        // Add more line heights if needed
      },
      colors: {
        primary: "var(--primary-color)",
        "nav-color-1": "var(--nav-color-1)",
        "nav-color-2": "var(--nav-color-2)",
        "nav-color-bg": "var(--nav-color-bg)",
        // Define your other colors here
        "background-color": "var(--background-color)",
        "background-color-transparent": "var(--background-color-transparent)",
        "background-color-transparent-15":
          "var(--background-color-transparent-15)",
        "background-color-transparent-40":
          "var(--background-color-transparent-40)",
        "background-color-transparent-80":
          "var(--background-color-transparent-80)",
        "second-background-color": "var(--second-background-color)",
        "third-background-color": "var(--third-background-color)",
        "third-background-color-transparent":
          "var(--third-background-color-transparent)",
        "first-text-color": "var(--first-text-color)",
        "second-text-color": "var(--second-text-color)",
        "third-text-color": "var(--third-text-color)",
        "fourth-text-color": "var(--fourth-text-color)",
        "default-text-color": "var(--default-text-color)",
        "invert-text-color": "var(--invert-text-color)",
        "border-color": "var(--border-color)",
        "selection-color": "var(--selection-color)",
        "shadow-color-1": "var(--shadow-color-1)",
        "shadow-color-2": "var(--shadow-color-2)",
        "shadow-hover-color": "var(--shadow-hover-color)",
        "scrollbar-color": "var(--scrollbar-color)",
        "scrollbar-color-hover": "var(--scrollbar-color-hover)",
        "scroll-bar-bg-color": "var(--scroll-bar-bg-color)",
        "link-color": "var(--link-color)",
        "copyright-info-color": "var(--copyright-info-color)",
        "avatar-background-color": "var(--avatar-background-color)",
        "pjax-progress-bar-color": "var(--pjax-progress-bar-color)",
        "archive-timeline-last-child-color":
          "var(--archive-timeline-last-child-color)",
        "note-blue-title-bg": "var(--note-blue-title-bg)",
        "note-red-title-bg": "var(--note-red-title-bg)",
        "note-cyan-title-bg": "var(--note-cyan-title-bg)",
        "note-green-title-bg": "var(--note-green-title-bg)",
        "note-yellow-title-bg": "var(--note-yellow-title-bg)",
        "note-gray-title-bg": "var(--note-gray-title-bg)",
        "note-type-title-bg": "var(--note-type-title-bg)",
        "note-black-title-bg": "var(--note-black-title-bg)",
        "note-purple-title-bg": "var(--note-purple-title-bg)",
        "home-banner-img": "var(--home-banner-img)",
        "home-banner-text-color": "var(--home-banner-text-color)",
        "home-banner-icons-container-border-color":
          "var(--home-banner-icons-container-border-color)",
        "home-banner-icons-container-background-color":
          "var(--home-banner-icons-container-background-color)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        redefine:
          "0px 6px 24px 0px var(--shadow-color-2), 0px 0px 0px 1px var(--shadow-color-1)",
        "redefine-hover":
          "0px 6px 24px 0px var(--shadow-color-2), 0px 0px 0px 1px var(--shadow-color-1), 0px 0px 0px 1px inset var(--shadow-color-1)",
        "redefine-flat":
          "0px 1px 4px 0px var(--shadow-color-2), 0px 0px 0px 1px var(--shadow-color-1)",
        "redefine-flat-hover":
          "0px 1px 4px 0px var(--shadow-color-2), 0px 0px 0px 1px var(--shadow-color-1), 0px 0px 0px 1px inset var(--shadow-color-1)",
      },
    },
  },
  plugins: [],
};
