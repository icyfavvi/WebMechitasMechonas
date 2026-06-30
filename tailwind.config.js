/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E29598",
          dark: "#C87679",
          light: "#F0A9AC",
          pale: "#FDEAEB",
        },
        dark: "#6A5C5C",
        neutral: {
          50: "#FDF8F5",
          100: "#F3EBE1",
          200: "#E6DCD1",
          500: "#8C7C7C",
        },
        green: {
          DEFAULT: "#98A892",
          dark: "#7D8C78",
          pale: "#EBF1E9",
        }
      },
      fontFamily: {
        display: ["'Great Vibes'", "cursive"],
        body: ["'Nunito'", "system-ui", "sans-serif"],
        serif: ["'Lora'", "serif"],
      },
      borderRadius: {
        "4xl":"2rem","5xl":"2.5rem","6xl":"3rem","blob":"30% 70% 70% 30%/30% 30% 70% 70%",
      },
      boxShadow: {
        primary: "0 8px 32px rgba(233,30,140,.28)",
        "primary-lg": "0 16px 48px rgba(233,30,140,.35)",
        card: "0 2px 16px rgba(0,0,0,.06)",
      },
      keyframes: {
        fadeUp:     {"0%":{opacity:0,transform:"translateY(24px)"},"100%":{opacity:1,transform:"translateY(0)"}},
        fadeIn:     {"0%":{opacity:0},"100%":{opacity:1}},
        float:      {"0%,100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-10px)"}},
        wiggle:     {"0%,100%":{transform:"rotate(-6deg)"},"50%":{transform:"rotate(6deg)"}},
        shimmer:    {"0%":{backgroundPosition:"200% center"},"100%":{backgroundPosition:"-200% center"}},
        scaleIn:    {"0%":{transform:"scale(0.92)",opacity:0},"100%":{transform:"scale(1)",opacity:1}},
        slideBow:   {"0%":{transform:"translateX(-8px)",opacity:0},"100%":{transform:"translateX(0)",opacity:1}},
        pulse_soft: {"0%,100%":{transform:"scale(1)"},"50%":{transform:"scale(1.04)"}},
      },
      animation: {
        "fade-up":   "fadeUp .6s ease both",
        "fade-in":   "fadeIn .5s ease both",
        "float":     "float 3.5s ease-in-out infinite",
        "wiggle":    "wiggle 1.5s ease-in-out infinite",
        "shimmer":   "shimmer 2.5s linear infinite",
        "scale-in":  "scaleIn .4s ease both",
        "slide-bow": "slideBow .4s ease both",
        "pulse-soft":"pulse_soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
