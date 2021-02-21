import { Firestore } from "../../../shared/firestore";
import { PeopleService } from "../../../services/people-service";
import { showOrBrowseSpeakers } from "../responses";

const peopleService = new PeopleService(Firestore.db);

export async function browseSpeaker(conv, params) {
  console.log(`Handle intent :: browseSpeaker`, conv.actions, params);

  const items = await peopleService.getPeople(20);
  showOrBrowseSpeakers(conv, items);
}
