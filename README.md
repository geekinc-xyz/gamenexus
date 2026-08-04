# GameNexus
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/geekinc-xyz/gamenexus)

GameNexus is a modern web application for discovering and exploring video games. Built with Next.js and Firebase, it provides a comprehensive catalog of games, franchises, and development studios by leveraging the IGDB API. It also features the latest gaming news from IGN and includes AI-powered functionalities through Google's Genkit framework.

## Features

-   **Game Discovery**: Browse, search, and filter a vast library of games by platform, popularity, release date, and more.
-   **Detailed Information**: View in-depth details for each game, including descriptions, ratings, platforms, genres, developers, media (screenshots, trailers), and more.
-   **Franchise Exploration**: Explore entire game sagas and see all the titles within a franchise.
-   **Studio Profiles**: Discover development studios and the games they have created.
-   **Latest News**: Stay up-to-date with the latest gaming news, sourced directly from the IGN RSS feed.
-   **AI-Powered**: Integrates Google's Genkit for advanced AI capabilities.
-   **Multi-Language Support**: Full support for both English and French.
-   **Theming**: Switch between light and dark modes for a comfortable viewing experience.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Game Data API**: [IGDB](https://www.igdb.com/api)
-   **News Source**: [IGN RSS Feed](https://www.ign.com/rss)
-   **AI**: [Google Genkit](https://firebase.google.com/docs/genkit) with [Gemini](https://ai.google.dev/gemini-api)
-   **Hosting & Backend**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) & [Firestore](https://firebase.google.com/docs/firestore)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To run GameNexus locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/geekinc-xyz/gamenexus.git
cd gamenexus
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project by copying the `.env.example` file.

```bash
cp .env.example .env.local
```

Fill in the `.env.local` file with your credentials:

-   **Firebase**:
    -   Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    -   Add a new Web App and copy the configuration details into the `NEXT_PUBLIC_FIREBASE_*` variables.
-   **IGDB**:
    -   Create an application on the [Twitch Developer Portal](https://dev.twitch.tv/console) to get a Client ID and Client Secret for the IGDB API.
    -   Populate `IGDB_CLIENT_ID` and `IGDB_CLIENT_SECRET`. You can leave `IGDB_ACCESS_TOKEN` empty, as the application will generate one automatically.
-   **Gemini API**:
    -   Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   Set the `GEMINI_API_KEY` variable.

### 4. Run the Development Servers

GameNexus uses two development servers: one for the Next.js frontend and another for the Genkit AI backend.

-   **To run the Next.js app:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

-   **To run the Genkit AI flows:**
    ```bash
    npm run genkit:dev
    ```
    The Genkit Developer UI will be available at `http://localhost:4000`.

## Available Scripts

The following scripts are available in the `package.json`:

| Script         | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `npm run dev`        | Starts the Next.js development server on port 3000.              |
| `npm run genkit:dev` | Starts the Genkit development server with hot-reloading.         |
| `npm run build`      | Builds the Next.js application for production.                 |
| `npm run start`      | Starts the production server for the built application.          |
| `npm run lint`       | Lints the codebase using Next.js's built-in ESLint config.       |
| `npm run typecheck`  | Runs the TypeScript compiler to check for type errors.           |

## Project Structure

The repository is organized as follows:

```
.
├── src
│   ├── ai/            # Genkit AI flows and configuration
│   ├── app/           # Next.js App Router pages and layouts
│   ├── components/    # Reusable React components (including shadcn/ui)
│   ├── context/       # React Context providers (Firebase, Language)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Core application logic, API clients, and type definitions
│   └── pages/         # Required Next.js files for custom App/Document/Error
├── public/            # Static assets
└── .env.example       # Template for environment variables
