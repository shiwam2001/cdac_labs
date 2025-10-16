const config = {
  plugins: ["@tailwindcss/postcss"],
  theme: {
     colors: {
    primary: "#1d4ed8", // instead of oklch
    secondary: "#9333ea",
    // aur jo bhi chahiye
  },
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  corePlugins: {
    preflight: true,
  },
};
// module.exports = {
//   theme: {
//     extend: {},
//   },
//   experimental: {
//     optimizeUniversalDefaults: true,
//   },
//   corePlugins: {
//     preflight: true,
//   },
// }

export default config;
