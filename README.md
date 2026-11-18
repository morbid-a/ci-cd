# node-auth-app (starter for CI/CD Part 1)

Register / log in app with three containers:

    browser -> frontend (nginx, :5173) -> backend (Node/Express, :3000) -> db (Postgres)

    node-auth-app/
    ├── frontend/            # Vite app + Dockerfile + nginx.conf
    ├── backend/             # Express API + Dockerfile
    ├── docker-compose.yml   # db + backend + frontend
    ├── tests/auth.spec.js   # Playwright tests (run against the full stack)
    └── playwright.config.js

## Run it
    docker compose up --build        # then open http://localhost:5173
    docker compose down              # stop (users are kept in the db-data volume)
    docker compose down -v           # stop and DELETE the users

## Test it
    npm install
    npx playwright install chromium  # or set PW_CHANNEL=chrome / msedge to use an installed browser
    npx playwright test              # starts the stack itself if it is not running

CI/CD deployment demonstration!