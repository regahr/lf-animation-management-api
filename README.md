<p align="center">
    <h1 align="center">Lottie Animation Management System API</h1>
</p>

<p align="center">
	<img src="https://img.shields.io/github/license/regahr/lf-animation-management-api?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/regahr/lf-animation-management-api?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/regahr/lf-animation-management-api?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/regahr/lf-animation-management-api?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
	<img src="https://img.shields.io/badge/GraphQL-E10098.svg?style=flat&logo=GraphQL&logoColor=white" alt="GraphQL">
	<img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white" alt="Prisma">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black" alt="Prettier">
	<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style=flat&logo=ts-node&logoColor=white" alt="tsnode">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
</p>
<hr>

This project is a GraphQL API for managing Lottie animations, built using GraphQL-Yoga and Prisma ORM with SQLite.

**Deployed at**: [https://lf-animation-management-api.onrender.com/graphql](https://lf-animation-management-api.onrender.com/graphql)

## Table of Contents

- [Design Decisions](#design-decisions)
- [API Schema](#api-schema)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Conclusion](#conclusion)

## Design Decisions

1. **GraphQL-Yoga**: Chosen for its simplicity and ease of setup, making it ideal for rapid development.
2. **Prisma ORM with SQLite**: Utilized for efficient database management, allowing quick integration with SQLite for data persistence.
3. **TypeScript**: Employed for type safety and improved developer experience.
4. **Render**: Selected for deployment due to its ease of use and straightforward setup process.
5. **Model Division**:
   - **Animation**: Contains core information such as `id`, `createdAt`, and `name`.
   - **Content**: Includes `filename`, `filetype`, `metadata`, `content` (stringified JSON), and a foreign key to `Animation`.
   - **Metadata**: Holds `version`, `revision`, `keywords`, `author`, `generator`, and a foreign key to `Animation`.
6. **Type Definitions**:
   - **Query**: `getAnimation` accepts filters to search by `Animation.name`, `Animation.Metadata.author`, and `Animation.Metadata.keywords`.
   - **Mutation**: `uploadAnimation` accepts a file, validates its extension, parses the JSON content from dotLottie files, and stores the data accordingly.
7. **Code Organization**:
   - Utils and TypeScript types are separated into distinct files for better readability and developer experience.
   - Main file (`main.ts`) is kept simple.
8. **Prettier**: Used for code formatting to maintain cleanliness and consistency.

## API Schema

### Models

- **Animation**

  ```graphql
  type Animation {
    id: ID!
    name: String!
    content: Content!
    metadata: Metadata
    createdAt: String!
  }
  ```

- **Content**

  ```graphql
  type Content {
    id: ID!
    filename: String!
    filetype: String!
    content: String!
    metadata: String
    animation: Animation!
  }
  ```

- **Metadata**
  ```graphql
  type Metadata {
    id: ID!
    version: String
    revision: String
    keywords: String
    author: String
    generator: String
    animation: Animation!
  }
  ```

### Operations

- **Query**

  ```graphql
  type Query {
    getAnimation(filter: String, skip: Int, take: Int): [Animation!]
  }
  ```

- **Mutation**

```graphql
type Mutation {
  uploadAnimation(file: File!): Animation!
}
```

## Setup and Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/regahr/lf-animation-management-api
   cd lottie-animation-management
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Run database migrations**:

   ```sh
   npx prisma migrate dev
   ```

4. **Run prisma module generation**:

   ```sh
   npx prisma generate
   ```

5. **Start the server**:

   ```sh
   npm run start
   ```

## Usage

1. **Uploading an Animation**:

   - Use the `uploadAnimation` mutation to upload a dotLottie file. The server will validate and parse the file, storing the animation and metadata in the database.

2. **Querying Animations**:
   - Use the `getAnimation` query with optional filters (`name`, `author`, `keywords`) to retrieve animations from the database.

## Folder Structure

```
lottie-animation-management/
│
├── prisma/
│ └── schema.prisma
│
├── src/
│ ├── context.ts
│ ├── main.ts
│ ├── schema.ts
│ ├── type.ts
│ └── util.ts
├── .tsconfig.json
├── package.json
└── README.md
```

## Conclusion

This API provides a robust solution for managing Lottie animations with features for uploading and querying animations efficiently. The use of GraphQL-Yoga and Prisma ensures a smooth development process and efficient database management.
