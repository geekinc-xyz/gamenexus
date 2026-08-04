'use server';

import type { Game, Platform, Franchise, Studio } from './types';

const IGDB_API_URL = 'https://api.igdb.com/v4';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(forceRefresh = false): Promise<string | null> {
  if (forceRefresh) {
    cachedToken = null;
    tokenExpiresAt = 0;
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (ACCESS_TOKEN && ACCESS_TOKEN !== 'your_access_token_here' && ACCESS_TOKEN.trim() !== '' && !forceRefresh) {
    return ACCESS_TOKEN;
  }

  if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID === 'your_client_id_here' || CLIENT_SECRET === 'your_client_secret_here') {
    return null;
  }

  try {
    const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    const response = await fetch(tokenUrl, {
      method: 'POST',
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Failed to fetch Twitch OAuth token:', response.status, errBody);
      return null;
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + ((data.expires_in || 3600) - 300) * 1000;
    return cachedToken;
  } catch (error) {
    console.error('Error fetching Twitch OAuth token:', error);
    return null;
  }
}

async function fetchFromIGDB(endpoint: string, query: string, retry = true): Promise<any> {
  const token = await getAccessToken();
  if (!CLIENT_ID || !token || CLIENT_ID === 'your_client_id_here') {
    console.warn('IGDB API credentials not configured. Please set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in environment variables.');
    if (endpoint.endsWith('/count')) return { count: 0 };
    return [];
  }
  
  try {
    const response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: query,
      next: { revalidate: 3600 }
    });

    if (response.status === 401 && retry) {
      console.warn('IGDB returned 401 Unauthorized. Refreshing token and retrying...');
      const newToken = await getAccessToken(true);
      if (newToken) {
        return fetchFromIGDB(endpoint, query, false);
      }
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`IGDB API error (${endpoint}): ${response.status} ${response.statusText}`, errorBody);
      if (endpoint.endsWith('/count')) {
        return { count: 0 };
      }
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('IGDB fetch exception:', error);
    if (endpoint.endsWith('/count')) {
      return { count: 0 };
    }
    return [];
  }
}

function formatCoverUrl(url?: string) {
  return url ? `https:${url.replace('t_thumb', 't_cover_big_2x')}` : '/placeholder.jpg';
}

function formatScreenshotUrl(url?: string) {
    return url ? `https:${url.replace('t_thumb', 't_screenshot_huge')}` : '/placeholder.jpg';
}

function formatLogoUrl(url?: string) {
    return url ? `https:${url.replace('t_thumb', 't_logo_med')}` : '/placeholder.jpg';
}

function mapGame(game: any): Game {
    const developers = (game.involved_companies || [])
        .filter((c: any) => c.developer)
        .map((c: any) => c.company).filter(Boolean);

    const publishers = (game.involved_companies || [])
        .filter((c: any) => c.publisher)
        .map((c: any) => c.company).filter(Boolean);

    return {
        id: game.id,
        name: game.name,
        description: game.summary,
        coverUrl: formatCoverUrl(game.cover?.url),
        platforms: game.platforms || [],
        rating: game.total_rating || 0,
        screenshots: (game.screenshots || []).map((ss: any) => ({
            id: ss.id,
            url: formatScreenshotUrl(ss.url)
        })),
        releaseDate: game.first_release_date,
        genres: game.genres || [],
        themes: game.themes || [],
        franchises: game.franchises || [],
        gameModes: game.game_modes || [],
        videos: game.videos || [],
        developers: developers,
        publishers: publishers,
    };
}

type GetGamesOptions = {
    search?: string;
    platform?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}

export async function getGames({ search = '', platform, page = 1, limit = 100, sortBy = 'total_rating_count desc' }: GetGamesOptions = {}): Promise<{ games: Game[], totalCount: number }> {
  let whereClauses = [
    'version_parent = null',
    'parent_game = null',
  ];

  if (platform !== '372') {
    whereClauses.push('first_release_date != null');
  }

  if ((!platform || platform === 'all') && !search) {
    whereClauses.push('total_rating > 0');
    whereClauses.push('total_rating_count > 0');
  }

  if (search) {
    whereClauses.push(`name ~ *"${search}"*`);
  }

  if (platform && platform !== 'all') {
    if (platform === '34') {
      whereClauses.push(`(platforms = 34 | platforms = 39 | platforms = 55)`);
    } else if (platform === '169') {
      whereClauses.push(`(platforms = 169 | name ~ *"Series X"* | name ~ *"Series S"* | name ~ *"Xbox Series"*)`);
    } else if (platform === '372') {
      whereClauses.push(`(platforms = 130 & (name ~ *"Switch 2"* | name ~ *"Switch II"* | name ~ *"Nintendo Switch 2"*)) | name ~ *"Switch 2"* | name ~ *"Switch II"*`);
    } else {
      whereClauses.push(`platforms = ${platform}`);
    }
  }

  const whereString = whereClauses.join(' & ');
  const offset = (page - 1) * limit;

  const countQuery = `where ${whereString};`;
  const countResult = await fetchFromIGDB('games/count', countQuery);
  const totalCount = countResult?.count || 0;

  const gamesQuery = `
      fields name, cover.url, platforms.name, total_rating, first_release_date;
      where ${whereString};
      sort ${sortBy};
      limit ${limit};
      offset ${offset};
  `;
    
  const games = await fetchFromIGDB('games', gamesQuery);
  const formattedGames = (games || []).map(mapGame);
  return { games: formattedGames, totalCount: Math.min(totalCount, 50000) };
}

export async function getGameDetails(id: number): Promise<Game | null> {
    const query = `
      fields 
        name, 
        summary, 
        cover.url, 
        platforms.name, 
        total_rating, 
        screenshots.url, 
        first_release_date,
        genres.name,
        themes.name,
        franchises.name,
        game_modes.name,
        videos.video_id,
        involved_companies.company.name,
        involved_companies.developer,
        involved_companies.publisher;
      where id = ${id};
    `;
    const games = await fetchFromIGDB('games', query);

    if (!games || games.length === 0) {
        return null;
    }

    return mapGame(games[0]);
}

export async function getPlatforms(): Promise<Platform[]> {
    return [
        { id: 6, name: 'PC' },
        { id: 7, name: 'PS1' },
        { id: 8, name: 'PS2' },
        { id: 9, name: 'PS3' },
        { id: 48, name: 'PS4' },
        { id: 167, name: 'PS5' },
        { id: 11, name: 'Xbox' },
        { id: 12, name: 'Xbox 360' },
        { id: 49, name: 'Xbox One' },
        { id: 169, name: 'Xbox Series X/S' },
        { id: 18, name: 'NES' },
        { id: 19, name: 'SNES' },
        { id: 4, name: 'N64' },
        { id: 21, name: 'GameCube' },
        { id: 5, name: 'Wii' },
        { id: 41, name: 'Wii U' },
        { id: 130, name: 'Nintendo Switch' },
        { id: 372, name: 'Nintendo Switch 2' },
        { id: 34, name: 'Mobile' },
    ];
}

type GetFranchisesOptions = {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}

export async function getFranchises({ page = 1, limit = 20, search = '', sortBy = 'name asc' }: GetFranchisesOptions = {}): Promise<{ franchises: Franchise[], totalCount: number }> {
    const offset = (page - 1) * limit;
    let whereClauses = ['games > 0'];

    if (search) {
        whereClauses.push(`name ~ *"${search}"*`);
    }

    const whereString = whereClauses.join(' & ');
    const countQuery = `where ${whereString};`;
    const countResult = await fetchFromIGDB('franchises/count', countQuery);
    const totalCount = countResult?.count || 0;

    const franchisesQuery = `
        fields 
            name, 
            games.name,
            games.cover.url;
        where ${whereString};
        sort ${sortBy};
        limit ${limit};
        offset ${offset};
    `;
    const franchises = await fetchFromIGDB('franchises', franchisesQuery);

    const finalFranchises = (franchises || []).map((franchise: any) => {
        const gameWithCover = franchise.games?.find((g: any) => g.cover?.url);
        const coverUrl = gameWithCover ? formatCoverUrl(gameWithCover.cover.url) : '/placeholder.jpg';

        return {
            id: franchise.id,
            name: franchise.name,
            coverUrl: coverUrl,
            games: franchise.games || [],
        };
    });

    return { franchises: finalFranchises, totalCount };
}

export async function getFranchiseDetails(id: number): Promise<Franchise | null> {
    const query = `
        fields 
            name, 
            games.name,
            games.cover.url,
            games.platforms.name,
            games.total_rating,
            games.first_release_date;
        where id = ${id};
    `;
    const franchises = await fetchFromIGDB('franchises', query);

    if (!franchises || franchises.length === 0) {
        return null;
    }

    const franchise = franchises[0];
    const sortedGames = (franchise.games || []).sort((a: any, b: any) => (b.first_release_date || 0) - (a.first_release_date || 0));

    return {
        id: franchise.id,
        name: franchise.name,
        coverUrl: sortedGames.length > 0 && sortedGames[0].cover ? formatCoverUrl(sortedGames[0].cover.url) : '/placeholder.jpg',
        games: sortedGames.map(mapGame),
    };
}

type GetStudiosOptions = {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
}

export async function getStudios({ page = 1, limit = 20, search = '', sortBy = 'name asc' }: GetStudiosOptions = {}): Promise<{ studios: Studio[], totalCount: number }> {
    const offset = (page - 1) * limit;
    let whereClauses = ['developed != null', 'logo != null'];

    if (search) {
        whereClauses.push(`name ~ *"${search}"*`);
    }
    
    const whereString = whereClauses.join(' & ');
    const countQuery = `where ${whereString};`;
    const countResult = await fetchFromIGDB('companies/count', countQuery);
    const totalCount = countResult?.count || 0;

    const studiosQuery = `
        fields name, logo.url, developed.id;
        where ${whereString};
        sort ${sortBy};
        limit ${limit};
        offset ${offset};
    `;
    const studios = await fetchFromIGDB('companies', studiosQuery);
    
    const finalStudios = (studios || []).map((studio: any) => ({
        id: studio.id,
        name: studio.name,
        logoUrl: formatLogoUrl(studio.logo?.url),
        developed: studio.developed || [],
    }));

    return { studios: finalStudios, totalCount };
}

export async function getStudioDetails(id: number): Promise<Studio | null> {
    const studioQuery = `
        fields name, developed, logo.url;
        where id = ${id};
        limit 1;
    `;
    const studios = await fetchFromIGDB('companies', studioQuery);
    if (!studios || studios.length === 0) {
        return null;
    }
    const studioData = studios[0];
    const gameIds = studioData.developed;

    if (!gameIds || gameIds.length === 0) {
        return {
            id: studioData.id,
            name: studioData.name,
            logoUrl: formatLogoUrl(studioData.logo?.url),
            developed: []
        };
    }
    
    const allGames: Game[] = [];
    const chunkSize = 499;
    for (let i = 0; i < gameIds.length; i += chunkSize) {
        const chunk = gameIds.slice(i, i + chunkSize);
        const gamesQuery = `
            fields name, cover.url, platforms.name, total_rating, first_release_date;
            where id = (${chunk.join(',')});
            sort first_release_date desc;
            limit 500;
        `;
        const gamesData = await fetchFromIGDB('games', gamesQuery);
        if (gamesData) {
            allGames.push(...gamesData.map(mapGame));
        }
    }

    return {
        id: studioData.id,
        name: studioData.name,
        logoUrl: formatLogoUrl(studioData.logo?.url),
        developed: allGames,
    };
}
