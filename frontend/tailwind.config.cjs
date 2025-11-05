/**** Tailwind Config ****/
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0b0b0b',
        accent: '#e50914'
      },
      boxShadow: {
        'red-glow': '0 0 30px 0 rgba(229, 9, 20, 0.25)',
        'red-glow-strong': '0 0 50px 0 rgba(229, 9, 20, 0.45)'
      }
    }
  },
  plugins: []
}
