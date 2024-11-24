# **GraphQL Demo Project**

This project demonstrates the use of **GraphQL** to query and unify data from multiple sources: a **PostgreSQL** database for relational data and a **MongoDB** database for document-based data. The project is built with **Node.js**, **Express**, and **Apollo Server** and uses **Docker Compose** for easy setup and deployment.

---

## **Features**

- **GraphQL API**:
  - Query data from PostgreSQL and MongoDB using a unified GraphQL schema.
  - Support for filtering and dynamic arguments.
- **PostgreSQL**:
  - Stores relational data in a `users` table.
  - Pre-populated with sample data during initialization.
- **MongoDB**:
  - Stores document-based data in a `documents` collection.
  - Sample data initialization with a script that prevents duplicate entries.
- **Docker Compose**:
  - Orchestrates PostgreSQL, MongoDB, and the GraphQL server for seamless deployment.

---

## **Technologies Used**

- **Backend**: Node.js, Express, Apollo Server
- **Databases**: PostgreSQL, MongoDB
- **Containerization**: Docker, Docker Compose
- **Language**: JavaScript

### **3. Project Structure**

```
graphql-demo/
├── backend/
│   ├── index.js            # Main server file
│   ├── schema.js           # GraphQL schema
│   ├── initMongo.js        # MongoDB initialization script
│   ├── entrypoint.sh       # Entry point for backend Docker container
│   ├── package.json        # Node.js dependencies
│   ├── Dockerfile          # Dockerfile for backend
├── migrations/
│   ├── init.sql            # PostgreSQL initialization script
├── docker-compose.yml      # Docker Compose configuration
├── README.md               # Project documentation
```

---

## **Getting Started**

### **1. Prerequisites**

Ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (if running locally without Docker)


### **2. Clone the Repository**

```bash
git clone https://github.com/your-username/graphql-demo.git
cd graphql-demo
```

### **3. Run the project**

```
docker-compose up --build
```

### **4. Access the GraphQL Playground** 
Open your browser and go to: http://localhost:4000/graphql

---

### **4. Test the API**
You can use an initial query like:

```
query ExampleQuery {
  users {
    name
    email
  }
  documents {
    content
  }
}
```
Here, `users` are queried from *PostgresDB* and the `documents` from *MongoDB*

---
Made by Simon Garmendia

