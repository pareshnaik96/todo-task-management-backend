# todo-task-management-backend

## 🚀 Project Setup

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/pareshnaik96/todo-task-management-backend.git
cd todo-task-management-backend
```

### 2. Install Dependencies

Install the required packages using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and rename it to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# .env
DATABASE_URL=database_url
API_KEY=api_key
PORT=5000
```

### 4. Available Scripts

- **Start development server with auto-reloading:**

  ```bash
  npm run dev
  ```

- **Build the project:**

  ```bash
  npm run build
  ```

  This will remove the `dist` folder and compile TypeScript files into the `dist` directory.

- **Start the production server:**

  ```bash
  npm start
  ```

  This runs the compiled JavaScript from the `dist` folder.
