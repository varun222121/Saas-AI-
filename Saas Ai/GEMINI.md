# Project Overview

This is a React-based web application that provides a suite of AI-powered tools. The project is built with Vite, uses Tailwind CSS for styling, and incorporates Clerk for user authentication. The application features a landing page and a dashboard with various AI functionalities, including a text rewriter, blog title generator, image generator, and more.

## Building and Running

To get the project up and running, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

4.  **Lint the Code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Routing:** The project uses `react-router-dom` for routing. All routes are defined in `src/App.jsx`.
*   **Styling:** Tailwind CSS is used for styling.
*   **Authentication:** User authentication is handled by Clerk. The publishable key is stored in the `.env` file.
*   **Components:** Reusable components are located in the `src/Components` directory.
*   **Pages:** The different pages of the application are located in the `src/Pages` directory.
