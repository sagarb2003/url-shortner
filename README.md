# URL Shortener

This is a simple URL shortening service built with Node.js, Express, and Drizzle ORM. It provides endpoints for user registration, authentication, and URL shortening operations.

## Features

- User registration and login with JWT authentication
- Generate short URLs for long links
- Redirect to the original URL using the short code
- Request validation and error handling

## Technology Stack

- Node.js
- Express
- Drizzle ORM
- JSON Web Tokens (JWT)
- Postgress via `drizzle.config.js`

## Project Structure

```
├── controllers/
│   ├── url.controller.js
│   └── user.controller.js
├── db/
│   └── index.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   ├── index.js
│   ├── url.model.js
│   └── user.model.js
├── routes/
│   ├── url.route.js
│   └── user.routes.js
├── utils/
│   └── hash.js
├── validations/
│   └── request.validation.js
├── index.js
├── package.json
└── docker-compose.yml
```

## Usage

Start the server:

```bash
npm run start
```

### API Endpoints

- `POST /users/register` - Register a new user
- `POST /users/login` - Authenticate a user and receive a JWT
- `POST /urls` - Create a short URL (requires authentication)
- `GET /:shortCode` - Redirect to the original URL
- `GET /allUrls` - Return all Urls for a user(requires authentication)
- `DELETE /:id` - Delete the url for authenticated users only