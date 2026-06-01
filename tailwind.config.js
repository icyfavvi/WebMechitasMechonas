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
          // Rosas pastel principales
          blush:    "#FAD4D8", // rosa bebé suave
          petal:    "#F7BBC3", // rosa pétalo
          rose:     "#F29EAB", // rosa medio (hover, accents)
          mauve:    "#C47D8B", // rosa oscuro / burdeos suave
          burgundy: "#9B4F60", // burdeo profundo (CTA, bordes activos)

          // Neutros cálidos
          cream:    "#FFF8F5", // blanco crema (background)
          pearl:    "#FDF1F3", // blanco perla (cards)
          lace:     "#F5E6EA", // encaje rosado (secciones alternadas)
          dust:     "#D9B8BF", // polvo rosado (borders, dividers)

          // Tipografía
          ink:      "#3D2B30", // marrón muy oscuro (texto principal)
          mist:     "#7A5662", // gris rosado (texto secundario)
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        script:  ["'Dancing Script'", "cursive"],
        body:    ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        petal:  "0 2px 16px 0 rgba(242,158,171,0.18)",
        bloom:  "0 6px 32px 0 rgba(196,125,139,0.18)",
        soft:   "0 1px 8px 0 rgba(61,43,48,0.07)",
        ribbon: "inset 0 -2px 0 0 #F7BBC3",
      },
      backgroundImage: {
        "coquette-gradient":
          "linear-gradient(135deg, #FFF8F5 0%, #FAD4D8 50%, #F7BBC3 100%)",
        "hero-gradient":
          "linear-gradient(160deg, #FFF8F5 0%, #FDF1F3 40%, #FAD4D8 100%)",
        "card-shimmer":
          "linear-gradient(105deg, #FDF1F3 0%, #FFF8F5 50%, #F5E6EA 100%)",
        "ribbon-stripe":
          "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(247,187,195,0.15) 6px, rgba(247,187,195,0.15) 12px)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease both",
        "fade-in":    "fadeIn 0.4s ease both",
        "float":      "float 3s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
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
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-4px)" },
        },
      },
      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },
    },
  },
  plugins: [],
};
