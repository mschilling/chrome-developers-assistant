import { Event } from "../models/event";

export interface IEventService {
  getNextEvent(minDateIsoString?: string): Promise<Event>;
  getPreviousEvent(maxDateIsoString?: string): Promise<Event>;
  getPreviousEventByCountry(maxDateIsoString: string, country: string): Promise<Event>;
}
