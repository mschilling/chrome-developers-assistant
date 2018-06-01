import { Video } from "../models/video";

export interface IVideoService {
  Search(searchParams, limit: number): Promise<Video[]>;
  searchKeynoteVideos(eventName: string, year: number, limit: number): Promise<Video[]>;
  searchEventHighlightsVideo(eventKey: string): Promise<Video[]>;
  filterVideosBySpeakers(speakers, limit: number): Promise<Video[]>;
}
