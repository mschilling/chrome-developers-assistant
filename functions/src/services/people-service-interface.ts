import { Person } from "../models/person";

export interface IPeopleService {
  getPeople(limit?: number): Promise<Person[]>;
  getPerson(id: string): Promise<Person>;
}
