
  # Web App Dashboard Design

  This is a code bundle for Web App Dashboard Design. 
  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Deploying to GitHub Pages

  This project is configured to build into a `docs/` folder so it can be hosted directly from GitHub Pages on the `main` branch.

  Steps:
  1. Build the site: `npm run build`
  2. Commit the build output: `git add -A && git commit -m "build: pages"`
  3. Push to GitHub: `git push`
  4. In your repository settings on GitHub, enable Pages to serve from the `main` branch and `/docs` folder.

  The app uses relative asset paths and includes a 404.html redirect so client-side routing works when refreshing deep links.
  