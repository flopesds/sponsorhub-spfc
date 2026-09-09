import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spfc: {
          red: '#D71920',        // Vermelho Fibra
          black: '#000000',      // Preto Tradição
          white: '#FFFFFF',      // Branco
          valentim: '#48535A',   // Cinza Valentim
          peres: '#8A9297',      // Cinza Peres
        },
      },
    },
  },
  plugins: [],
};
export default config;
