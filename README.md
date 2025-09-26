

  # Overview

  This repository contains the front-end dashboard for Afribenki, designed to allow users (e.g. account holders, admins) to view their account metrics, transaction history, analytics visuals, and more. The dashboard is built with modern tooling and ready to be integrated with backend APIs or sandbox endpoints.

  During Soonami Venturethon Cohort 8, we worked on demonstrating Afribenki’s value-proposition through a working dashboard prototype, combining user experience design, data visualization, and modular architecture.

  ## Features

  - Secure login / authentication (stubbed or ready to connect to real auth)
  - Transaction / activity feed
  - Analytics & charts (balances over time, volume breakdowns, etc.)
  - Responsive UI (desktop & mobile)
  - Modular components for easy extension
  - Configurable to hook into sandbox or production APIs

  ## Tech Stack

  | Layer                | Technology / Library                                  |
  |----------------------|------------------------------------------------------|
  | UI Framework         | Vite + React                                         |
  | Language             | TypeScript                                           |
  | Styling              | CSS / Tailwind CSS                                   |
  | State Management     | (e.g. Zustand, React Context)                        |
  | Charting / Visualization | (e.g. Recharts)                                 |
  | Build Tool           | Vite                                                |
  | Deployment           | GitHub Pages / Static hosting                        |

  (Adjust the above stack entries to match what your dashboard actually uses.)

  ## Getting Started

  Clone the repository:

  ```sh
  git clone https://github.com/afribenki-global/dashboard.git
  cd dashboard
  ```

  Install dependencies:

  ```sh
  npm install
  ```

  Start the development server:

  ```sh
  npm run dev
  ```

  Open your browser at http://localhost:3000 (or whatever port Vite uses) to view the dashboard.

  ## Development

  - Code is structured in a modular fashion under `src/` (components, pages, services, etc.).
  - Update or configure API endpoints in a central config or environment file (e.g. `.env` or `config.ts`).
  - Use local mocks or sample JSON data until backend or sandbox APIs are available.
  - Follow component / style conventions to keep UI consistent.

  ## Deployment

  This project is set up to build into the `docs/` folder so it can be hosted via GitHub Pages from the `main` branch:

  Build the app:

  ```sh
  npm run build
  ```

  The built output will appear under `docs/`. Commit those files.

  In your repository settings, enable GitHub Pages to serve from the `main` branch and `/docs` directory.

  The routing is configured with a fallback `404.html` so client-side routing should work on refresh / deep links.

  ## How This Fits into Venturethon

  During the Soonami Venturethon Cohort 8 competition, our team focused on building prototypes that showcase real-world use cases. The dashboard plays a pivotal role in:

  - Demonstrating Afribenki’s product vision (user-facing interface)
  - Validating assumptions about what users want to see (analytics, history, balances)
  - Providing mock / demo flows to stakeholders and judges
  - Serving as a foundation to connect with APIs (sandbox / live) in future phases

  As the backend / API endpoints (sandbox or production) become available, this dashboard will evolve from prototype to production-grade interface.

  ## Contributing

  We welcome contributions! Whether it's UI refinements, new chart types, performance improvements, or integration with APIs, please feel free to:

  - Open an issue to discuss your idea
  - Fork the repo and make your changes
  - Submit a pull request

  Please follow our code style / linting rules and include tests (if applicable).

  ## License

  This project is open source and available under the MIT License.
  