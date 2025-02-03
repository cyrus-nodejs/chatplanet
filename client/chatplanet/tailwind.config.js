/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flyonui/dist/js/*.js",
    
]

export const darkmode = 'class'

export const plugin = [
    require("flyonui"),
    require("flyonui/plugin") 
]