import { SimpleResponse } from "actions-on-google";
import { buildSimpleCard, buildBrowseCarousel, buildCarousel } from '../../utils/responses';
import { Conversation } from '../../utils/conversation';
import { Person } from "../../models/person";
import { PeopleServiceExt } from "../../services/people-service";

export function showOrBrowseSpeakers(conv, items: Person[]) {
  if (items.length === 1) {
    showSpeaker(conv, items[0]);
    return;
  } else if (items.length > 1) {
    browseSpeakers(conv, items);
    return;
  }

  // Fallback when no blogs found
  showSpeakerNoResult(conv)

}

function showSpeaker(conv, speaker: Person) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `Meet ${speaker.first_name} ${speaker.last_name}.`,
      text: `Here's one of the speakers`,
    })
  );

  const cardData = PeopleServiceExt.asCard(speaker);
  conversation.addElement(buildSimpleCard(cardData));

  conversation.complete();
}

function browseSpeakers(conv, speakers: Person[]) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `I've found some speakers.`,
      text: `Here are some speakers`,
    })
  );

  const cardsData = PeopleServiceExt.asCards(speakers);
  conversation.addElement(buildCarousel(cardsData));

  conversation.complete();
}

function showSpeakerNoResult(conv) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `Sorry, I coudn\'t find any speakers right now. Anything else?`,
      text: `Couldn't find any speakers`,
    })
  );

  // conversation.addSuggestions(['Blogs by Jake', 'Blogs by Rob Dodson', 'Blogs by Monica']);

  conversation.complete();
}

