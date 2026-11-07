# castellers-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
The dev server runs on http://localhost:5173 and proxies `/api` to the API on http://localhost:8080.

### Compiles and minifies for production
```
npm run build
```

### Serves the production build locally
```
npm run preview
```

### Lints files
```
npm run lint
```

### Configuration
The app is built with [Vite](https://vite.dev/config/) (`vite.config.js`). Environment variables prefixed with `VITE_` or `VUE_APP_` (e.g. `VUE_APP_API_URL` in `.env.production`) are exposed to the app through `import.meta.env`.
