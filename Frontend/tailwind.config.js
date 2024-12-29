/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}", // src/pages 폴더의 모든 JS/JSX 파일
    "./node_modules/hanawebcore-frontend/**/*.{js,jsx,ts,tsx}", // 패키지의 컴포넌트도 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "winter", "autumn"],
  },
  prefix: "tw-",
};
