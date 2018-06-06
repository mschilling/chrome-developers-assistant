import { Show } from "../models/show";

export interface IShowService {
  getItems(inputFilters?: any): Promise<Show[]>;
}
