# Blog Backend Application

This is the backend for a simple blog application. It provides API endpoints for user authentication, blog post management, and commenting functionality.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/ALVINdimpos/blog-backend.git
   cd blog-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
DB_USER=blog_db_h2pk_user
DB_PASS=WYm9jSr3OK1ZIMfBWDEVdPbgHobwzfCv
DB_NAME=blog_db_h2pk
DB_HOST=dpg-cql26ll6l47c73f1uh2g-a.oregon-postgres.render.com

JWT_SECRET=secret
SALT_ROUNDS=10
JWT_EXPIRES_IN=1d
EMAIL_USER=fistonalvin@gmail.com
EMAIL_PASS=securepassword123
PORT=3000
NODE_ENV=development
   ```
   Replace the database URL and JWT secret with your own values.

4. Set up the database:
   - Create a PostgreSQL database named `blog_db`
   - Run migrations:
     ```
     npx sequelize-cli db:migrate
     ```

5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
- `POST /api/auth/login`: Login a user
  - Body: `{ "email": "string", "password": "string" }`

### Blog Posts

- `GET /api/posts`: Get all blog posts
- `GET /api/posts/:id`: Get a specific blog post
- `POST /api/posts`: Create a new blog post (authenticated)
  - Body: `{ "title": "string", "content": "string" }`
- `PUT /api/posts/:id`: Update a blog post (authenticated, author only)
  - Body: `{ "title": "string", "content": "string" }`
- `DELETE /api/posts/:id`: Delete a blog post (authenticated, author only)

### Comments

- `GET /api/posts/:postId/comments`: Get all comments for a blog post
- `POST /api/posts/:postId/comments`: Add a comment to a blog post (authenticated)
  - Body: `{ "content": "string" }`
- `PUT /api/comments/:id`: Update a comment (authenticated, comment author only)
  - Body: `{ "content": "string" }`
- `DELETE /api/comments/:id`: Delete a comment (authenticated, comment author or post author)

## Database Schema

### Users Table
- id (Primary Key)
- username
- email
- password (hashed)
- createdAt
- updatedAt

### Posts Table
- id (Primary Key)
- title
- content
- userId (Foreign Key referencing Users)
- createdAt
- updatedAt

### Comments Table
- id (Primary Key)
- content
- userId (Foreign Key referencing Users)
- postId (Foreign Key referencing Posts)
- createdAt
- updatedAt

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header of your requests:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures. Common status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

To run the server in development mode with hot reloading:

```
npm run dev
```


## Deployment

The backend is deployed on Render. Any push to the main branch will trigger a new deployment.

Deployed URL: https://blog-backend-5tid.onrender.com
