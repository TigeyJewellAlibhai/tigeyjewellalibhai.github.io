# TigrisLabs (React + Vite)

This app is configured for GitHub Pages hosting with a custom domain.

## Included GitHub Pages Support

- `public/CNAME` set to `tigrislabs.net`
- `public/404.html` SPA fallback redirect for BrowserRouter deep links
- `index.html` bootstrapping script to restore redirected routes
- `public/.nojekyll` to bypass Jekyll processing
- `.github/workflows/deploy-pages.yml` automated build + deploy on push to `main`

## Deploy Steps

1. Push this folder contents to the root of your GitHub repository.
2. In GitHub: Settings -> Pages -> Build and deployment, select `GitHub Actions`.
3. Push to `main` (or run the workflow manually from Actions).
4. Confirm your DNS points `tigrislabs.net` to GitHub Pages.

## Local Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
