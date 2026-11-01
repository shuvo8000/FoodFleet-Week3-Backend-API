# Week 3 — Phase 4: Restaurant & Food CRUD APIs

## Implemented
- Public restaurant listing with search, city/division, open-state filters and pagination.
- Public restaurant detail endpoint with available menu items.
- Admin-only restaurant create, update and deactivate endpoints.
- Public category listing and admin-only category create, update and deactivate endpoints.
- Public food listing with restaurant/category/search/featured filters.
- Public food detail endpoint.
- Admin-only food create, update and deactivate endpoints.
- JWT-backed admin authorization. Public registration cannot assign an admin role.
- Interactive CLI command to create an administrator.
- Seed command to import the original frontend catalog into SQLite.
- API tests for public access, admin authorization and catalog CRUD.
- SQLite schema upgrade logic for newly added nullable catalog fields; it preserves existing user rows.

## Original frontend data import
The source frontend catalog contains 11 category records, 44 restaurant records and 28 food records. The seed command also creates any food categories not present in the category grid. One food record (`f25`, Jhalmuri Special) refers to restaurant ID `r11`, which is missing from the source restaurant array. The seed command skips and reports that one record rather than inventing a restaurant.

The frontend's original restaurant IDs (`r1`, `r2`, ...) are not database primary keys. The seed command relates food records to the correct restaurant while importing. Frontend-to-API ID mapping is part of the later integration phase.

## Local setup from backend/
```powershell
python -m flask --app run.py init-db
python -m flask --app run.py create-admin
python -m flask --app run.py seed-demo-data
python -m pytest
```

## Security
- All catalog write endpoints require a JWT belonging to a user whose database role is `admin`.
- Customers can read public catalog endpoints but cannot create, update or delete catalog data.
- Delete endpoints deactivate catalog records where practical, preserving historical references.
- Never commit `.env`, SQLite files containing personal data, or access tokens.
