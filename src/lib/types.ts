



export type PlatformName = 
  | 'PC'
  | 'PlayStation'
  | 'Xbox'
  | 'Nintendo Switch'
  | 'macOS';

export type Platform = {
  id: number;
  name: string;
};

export type GameImage = {
  id: number;
  url: string;
}

type IdName = {
  id: number;
  name: string;
}

export type GameVideo = {
  id: number;
  video_id: string;
}

export type Game = {
  id: number;
  name: string;
  description: string;
  coverUrl: string;
  platforms: Platform[];
  rating: number;
  screenshots: GameImage[];
  releaseDate: number;
  genres: IdName[];
  franchises: IdName[];
  gameModes: IdName[];
  themes: IdName[];
  videos: GameVideo[];
  developers: IdName[];
  publishers: IdName[];
  reason?: string; // Optional field for AI recommendations
};

export type Price = {
  retailer: string;
  price: number;
};

export type GameStatus = "played" | "playing" | "unplayed";

export type UserGame = {
  gameId: number;
  status: GameStatus;
};

export type FavoriteItemType = 'game' | 'franchise';

export type FavoriteItem = {
    id: string; // Composite key like 'game-123' or 'franchise-456'
    itemId: number;
    itemType: FavoriteItemType;
    name: string;
    coverUrl: string;
    createdAt: string; // ISO Date string
}

export type UserList = {
    id: string;
    name: string;
    createdAt: string; // ISO Date string
    items: ListItem[]; 
    coverUrl?: string; 
}

export type ListItem = {
    id: string; // Composite key 'game-123' etc.
    itemId: number;
    itemType: FavoriteItemType;
    name: string;
    coverUrl: string;
    addedAt: string; // ISO Date string
}

export type Studio = {
  id: number;
  name: string;
  logoUrl: string;
  description?: string;
  startDate?: number;
  developed: Game[];
};

export type Franchise = {
    id: number;
    name: string;
    coverUrl: string;
    games: Game[];
};

export type NewsArticle = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    guid: string;
    imageUrl: string;
    creator: string;
};
