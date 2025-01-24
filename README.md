
<div align="center" width="100%">
    <img src="./stamp-logo.svg" width="100" alt="" />
</div>

# Secure-Stamp

**Secure-Stamp** is a service that allows you to embed invisible watermarks into images. Based on [Saasfly](https://github.com/saasfly/saasfly/tree/main), this project provides a secure way to insert digital watermarks into images while maintaining integrity and enabling easy verification.

This project aims to protect copyrights, prevent unauthorized reproduction, and provide an easy method for verifying digital signatures.

## Features

- **Invisible Watermarks**: Embed a watermark into the image in a way that it’s not visible to the naked eye, ensuring copyright protection.
- **Easy to Use**: Provides intuitive APIs and tools to easily add and manage watermarks without complicated configurations.
- **Digital Signatures & Verification**: Trace and verify images with watermarks to check for tampering or alterations.
- **Open-Source**: An open-source project based on Saasfly, which anyone can freely contribute to and use.

## 🚀 Getting Started

### 📋 Prerequisites

Before you start, make sure you have the following installed:

1. [Bun](https://bun.sh/) & [Node.js](https://nodejs.org/) & [Git](https://git-scm.com/)

   1. Linux

    ```bash
   curl -sL https://gist.github.com/tianzx/874662fb204d32390bc2f2e9e4d2df0a/raw -o ~/downloaded_script.sh && chmod +x ~/downloaded_script.sh && source ~/downloaded_script.sh
    ```

   2. MacOS

    ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   brew install git
   brew install oven-sh/bun/bun
   brew install nvm
    ```

2. [PostgreSQL](https://www.postgresql.org/)
   1. You can use Vercel Postgres or a local PostgreSQL server(add POSTGRES_URL env in .env.local)
      ```bash
      POSTGRES_URL = ''
      ```

### Installation

To get started with this boilerplate, we offer one options:

1. Manually clone the repository:

   ```bash
   git clone https://github.com/lazybrain80/stamp-book.git
   cd stamp-book
   bun install
   ```

### Setup

Follow these steps to set up your project:

1. Set up the environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Make sure you have a Postgres DB (If you don’t have a Postgres, click here) and have created a new database.
POSTGRES_URL must in your .env.local file:

   ```bash
   # Format Example
   # POSTGRES_URL="postgres://{USER}:{PASSWORD}@{DB_HOST}:{DB_PORT}/{DATABASE}"

   POSTGRES_URL="postgres://postgres:123456@127.0.0.1:5432/saasfly"
   ```
3. Then, use bun to create database tables:

   ```bash
   bun db:push
   ```

   Output:
   ```bash
   🚀  Your database is now in sync with your Prisma schema. Done in 151ms

   ┌─────────────────────────────────────────────────────────┐
   │  Update available 5.9.1 -> 5.10.2                       │
   │  Run the following to update                            │
   │    npm i --save-dev prisma@latest                       │
   │    npm i @prisma/client@latest                          │
   └─────────────────────────────────────────────────────────┘
   ```
4. Because some basic components are compile-time needed, you should run build first.
   ```bash
   bun run build
   ```

2. Run the development server:

   ```bash
   bun run dev:web
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Apps and Packages

- `web`: The main Next.js application
- `ui`: Shared UI components
- `db`: Database schema and utilities
- `auth`: Authentication utilities
- `email`: Email templates and utilities

## 📜 License

This project is licensed under the MIT License. For more information, see the [LICENSE](./LICENSE) file.