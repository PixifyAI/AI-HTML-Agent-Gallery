# AI-Generated Web Gallery

This project is a Next.js application designed to showcase single-file web applications and games created with agentic AI tools. It provides a gallery view with tabs for "Apps" and "Games", allowing users to browse and interact with the generated HTML files.

## Features

- Gallery view for AI-generated web apps and games.
- Tabs to switch between Apps and Games.
- Displays metadata (AI Tool, Model, Date Added) extracted from HTML file comments.
- Option to add new apps and games (via file upload).

## Setup

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd AI-HTML-Gallery
    ```

2.  **Install dependencies:**

    ```bash
    npm install --legacy-peer-deps
    ```
    _Note: `--legacy-peer-deps` is used to resolve potential dependency conflicts._

## Running the Project

To run the project in development mode:

```bash
npm run dev
```

This will start the development server, and you can access the application at `http://localhost:3000`.

To build the project for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Dockerization

To run this project using Docker, follow these steps:

1.  **Build the Docker image:**

    Navigate to the root directory of the project in your terminal and run the following command:

    ```bash
    docker build -t ai-html-gallery .
    ```

    This command builds the Docker image based on the `Dockerfile` in the current directory and tags it with the name `ai-html-gallery`.

2.  **Run the Docker container:**

    You can run the Docker container and map the application's port (3000) to a port on your host machine using the `-p` flag.

    If your application requires an API key (e.g., for the Gemini chat feature), you can pass it as an environment variable using the `-e` flag. Replace `YOUR_API_KEY_VALUE` with your actual API key.

    ```bash
    docker run -p 3000:3000 -e GEMINI_API_KEY=YOUR_API_KEY_VALUE ai-html-gallery
    ```

    If your application does not require an API key, you can omit the `-e` flag:

    ```bash
    docker run -p 3000:3000 ai-html-gallery
    ```

    Once the container is running, you can access the application in your web browser at `http://localhost:3000`.

## Project Structure

-   `/app`: Contains the Next.js application pages and API routes.
    -   `/app/page.tsx`: The main landing page with the gallery.
    -   `/app/apps/page.tsx`: Page specifically for displaying apps (though currently integrated into the main page).
    -   `/app/games/page.tsx`: Page specifically for displaying games (though currently integrated into the main page).
    -   `/app/api`: Contains API routes for file operations (upload, get file, get files) and comments.
-   `/components`: Reusable React components used in the application.
    -   `/components/gallery.tsx`: Component for displaying the gallery items.
    -   `/components/add-file-button.tsx`: Component for adding new files.
    -   `/components/ui`: UI components likely from a component library (e.g., Shadcn UI).
-   `/lib`: Utility functions.
    -   `/lib/file-utils.ts`: Functions for reading, saving, and extracting metadata from HTML files.
-   `/public`: Static assets and the directories for storing AI-generated apps and games.
    -   `/public/apps`: Directory where AI-generated apps (HTML files) are stored.
    -   `/public/games`: Directory where AI-generated games (HTML files) are stored.
-   `/styles`: Global styles.

## Adding New Apps or Games

Single-file HTML apps and games can be added to the gallery by placing the HTML files in the `public/apps` or `public/games` directories respectively.

Metadata such as the AI tool and model can be included in a comment on the first line of the HTML file in the format:

```html
<!-- Agent:[AI Tool Name], Model:[Model Name] -->
```
or
```html
// Agent:[AI Tool Name], Model:[Model Name]
```
or
```html
# Agent:[AI Tool Name], Model:[Model Name]
```

The application will extract this information and display it in the gallery.
