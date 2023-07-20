![image](https://github.com/Sn1r/tUCA-the-Ultimate-CRUD-API/assets/71400526/a6c41ab1-71f5-4ddb-83fd-fdfcac8adf6c)

# tUCA - the Ultimate CRUD API

tUCA is a RESTful API built with Express and MongoDB that provides full CRUD functionality for managing data. The API also supports GraphQL for advanced queries and filtering.

## Features

- Full CRUD (Create, Read, Update, Delete) functionality for managing data
- Supports RESTful API and GraphQL for advanced queries and filtering
- Uses MVC (Model-View-Controller) approach for better organization and separation of concerns
- Uses User authentication and authorization

## Getting Started

To get started with tUCA, follow these steps:

1. Clone the repository <br>
`git clone https://github.com/Sn1r/tUCA-the-Ultimate-CRUD-API.git`
2. Install the dependencies <br>
`npm install`
3. Create a `.env` file in the root directory of the project and set the following environment variables:
    - `MONGO_URI`: the connection string to your MongoDB database
    - `JWT_SECRET`: the secret key for generating JSON Web Tokens
4. Start the server <br>
`npm start`

## API Endpoints

tUCA exposes the following API endpoints:

- `GET /api/v1/books`: Get a list of all books
- `POST /api/v1/books`: Create a new book
- `GET /api/v1/books/:id`: Get a single book by ID
- `PUT /api/v1/books/:id`: Update a book by ID
- `DELETE /api/v1/books/:id`: Delete a book by ID

## GraphQL

tUCA also supports GraphQL for advanced queries and filtering. You can access the GraphQL playground at `/graphql`.
