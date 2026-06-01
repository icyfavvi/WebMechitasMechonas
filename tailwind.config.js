/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coquette: {
          blush:    "#FAD4D8",
          petal:    "#F7BBC3",
          rose:     "#F29EAB",
          mauve:    "#C47D8B",
          burgundy: "#9B4F60",
          cream:    "#FFF8F5",
          pearl:    "#FDF1F3",
          lace:     "#F5E6EA",
          dust:     "#D9B8BF",
          ink:      "#3D2B30",
          mist:     "#7A5662",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        script:  ["'Dancing Script'", "cursive"],
        body:    ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        petal:  "0 2px 16px 0 rgba(242,158,171,0.18)",
        bloom:  "0 6px 32px 0 rgba(196,125,139,0.18)",
        soft:   "0 1px 8px 0 rgba(61,43,48,0.07)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(160deg, #FFF8F5 0%, #FDF1F3 40%, #FAD4D8 100%)",
        "ribbon-stripe":
          "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(247,187,195,0.15) 6px, rgba(247,187,195,0.15) 12px)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease both",
        "fade-in":    "fadeIn 0.4s ease both",
        "float":      "float 3s ease-in-out infinite",
        "bounce-soft":"bounceSoft 1s ease infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
}
