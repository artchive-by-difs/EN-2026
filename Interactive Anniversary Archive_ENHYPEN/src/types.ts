export type Screen = 'boot' | 'dashboard' | 'photobooth' | 'result' | 'vault' | 'safezone' | 'system';

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  date: string;
  attachment?: string;
}

export interface PhotoResult {
  photo1: string;
  photo2: string;
}
