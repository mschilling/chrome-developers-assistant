import { SimpleResponse } from "actions-on-google";
import { buildSimpleCard, buildCarousel } from '../../utils/responses';
import { Conversation } from '../../utils/conversation';
import { Event } from "../../models/event";
import { EventServiceExt } from "../../services/events-service";

export function showOrBrowseEvents(conv, items: Event[]) {
  if (items.length === 1) {
    showEvent(conv, items[0]);
    return;
  } else if (items.length > 1) {
    browseEvents(conv, items);
    return;
  }

  // Fallback when no events found
  showEventNoResult(conv)
}

function showEvent(conv, event: Event) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `Meet ${event.name}`,
      text: `Here's one of the events`,
    })
  );

  const cardData = EventServiceExt.asCard(event);
  conversation.addElement(buildSimpleCard(cardData));

  conversation.complete();
}

function browseEvents(conv, events: Event[]) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `I've found some events.`,
      text: `Here are some events`,
    })
  );

  const cardsData = EventServiceExt.asCards(events);
  conversation.addElement(buildCarousel(cardsData));

  conversation.complete();
}

function showEventNoResult(conv) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `Sorry, I coudn\'t find any events right now. Anything else?`,
      text: `Couldn't find any events`,
    })
  );

  // conversation.addSuggestions(['Blogs by Jake', 'Blogs by Rob Dodson', 'Blogs by Monica']);

  conversation.complete();
}

