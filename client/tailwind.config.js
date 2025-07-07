/** @type {import('tailwindcss').Config} */
// export const content = [
//     "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/flyonui/dist/js/*.js",
    
// ]

// export const darkMode = 'class'



// export const plugin = [
//     require("flyonui"),
//     require("flyonui/plugin") 
// ]

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flyonui/dist/js/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
         colors: {
        slateBlue: '#6561b9',
        gunMetal:"#252d34",
        seaSalt:"FAFAFD",
        flashWhite:"F6F8FB",
      },
    },
  },
  plugins: [
    require("flyonui"),
    require("flyonui/plugin"),
  ],
}