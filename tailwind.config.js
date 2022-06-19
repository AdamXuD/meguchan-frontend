module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    textColor: () => ({
      primary: "var(--primary-text)",
      regular: "var(--regular-text)",
      secondary: "var(--secondary-text)",
      additional: "var(--additional-text)",
    }),
  },
  plugins: [],
};
