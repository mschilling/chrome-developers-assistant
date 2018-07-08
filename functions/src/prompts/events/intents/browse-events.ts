import { Firestore } from "../../../shared/firestore";
import { EventService } from "../../../services/events-service";
import { showOrBrowseEvents } from "../responses";

const eventService = new EventService(Firestore.db);

export async function browseEvents(conv, params) {
  console.log(`Handle intent :: browseEvents`, conv.actions, params);

  const items = await eventService.searchEvents({isShowcase: true});
  showOrBrowseEvents(conv, items);
}
