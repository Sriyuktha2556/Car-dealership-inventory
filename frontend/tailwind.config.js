/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0F172A",
          900: "#141C2E",
          800: "#1D2740",
          700: "#2A3654"
        },
        steel: {
          50: "#F4F6FA",
          100: "#E7EBF3",
          200: "#CBD4E5",
          300: "#A6B3CC",
          400: "#7C8BAE",
          500: "#5A6A90",
          600: "#445071",
          700: "#333D58"
        },
        accent: {
          500: "#D97706",
          600: "#B45309"
        },
        signal: {
          green: "#0F9D6B",
          amber: "#B7791F",
          red: "#C0392B"
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
