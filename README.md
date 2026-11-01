# FoodFleet

FoodFleet is a Bangladesh-focused food delivery web application. The existing front-end is built with HTML5, CSS3, and Vanilla JavaScript. Week 3 adds a Flask REST API and SQLite database.

## Project structure
- `index.html`, `pages/`, `css/`, `js/`, `assets/`: existing front-end
- `backend/`: Flask API application
- `docs/`: project and API documentation (to be completed during Week 3)

## Frontend
Open `index.html` in a browser for the current front-end demo. During backend integration, serve the frontend through a local development server and configure the allowed origin in `backend/.env`.

## Backend setup
See [backend/README.md](backend/README.md).

## Current Week 3 status
The backend starter scaffold is in place. The health endpoint is the first API. Database models, authentication, CRUD endpoints, cart/order APIs, frontend integration, and full API documentation are planned next.

## Security note
Do not store real passwords, NID numbers, or payment details in LocalStorage. The backend will store password hashes and apply access control. Do not commit `.env` or database files containing real user data.


## Week 3 — Phase 4 catalog APIs
The Flask backend now includes public restaurant, category and food listing/detail endpoints, plus admin-only create/update/deactivate endpoints. Existing frontend catalog data is bundled in `backend/data/seed_data.json` and can be imported into SQLite with the `seed-demo-data` Flask CLI command.

See `docs/API_Documentation.md` for endpoint details and `docs/Database_Schema.md` for the database design.
