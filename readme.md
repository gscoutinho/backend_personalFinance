# Personal Finance API

This project is a personal finance API built using Node.js, Express, and SQLite. It provides endpoints to manage users, categories, and registers for personal finance tracking.

## Table of Contents

- [Personal Finance API](#personal-finance-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Users](#users)
      - [Create User](#create-user)
      - [Get User](#get-user)
    - [Categories](#categories)
      - [Create Category](#create-category)
      - [Get Categories](#get-categories)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Create, read, update, and delete users.
- Create and read categories.
- Secure database interactions using parameterized queries to prevent SQL injection.
- Modular project structure for easy maintenance and scalability.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Initialize the database:
    ```sh
    node src/server.js
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. The server will run at `http://localhost:3000`.

## API Endpoints

### Users

#### Create User

- **Endpoint:** `POST /api/users`
- **Description:** Create a new user.
- **Request Body:**
    ```json
    {
      "name": "username",
      "password": "userpassword"
    }
    ```
- **Response:**
    - `201 Created` on success.
    - `500 Internal Server Error` on failure.

#### Get User

- **Endpoint:** `GET /api/users?name=username`
- **Description:** Get a user by name.
- **Query Parameters:**
    - `name` (string): The name of the user.
- **Response:**
    - `200 OK` with user data on success.
    - `404 Not Found` if user is not found.
    - `500 Internal Server Error` on failure.

### Categories

#### Create Category

- **Endpoint:** `POST /api/categories`
- **Description:** Create a new category.
- **Request Body:**
    ```json
    {
      "name": "categoryname",
      "subcategories": ["subcategory1", "subcategory2"]
    }
    ```
- **Response:**
    - `201 Created` on success.
    - `403 Forbidden` if category already exists.
    - `500 Internal Server Error` on failure.

#### Get Categories

- **Endpoint:** `GET /api/cat`
- **Description:** Get categories based on query parameters.
- **Query Parameters:**
    - `type` (string): Type of query, e.g., `all`.
    - `names` (string): Comma-separated list of category names to search.
- **Response:**
    - `200 OK` with categories data on success.
    - `404 Not Found` if no categories are found.
    - `500 Internal Server Error` on failure.

## Project Structure

