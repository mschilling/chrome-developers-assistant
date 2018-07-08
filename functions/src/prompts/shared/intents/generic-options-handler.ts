import { Firestore } from "../../../shared/firestore";
import { BlogPostService, BlogPostServiceExt } from "../../../services/blog-post-service";
import { YouTubeManager } from "../../../shared/youtube-manager";
import { DialogflowOption } from "../option-helper";
import { SimpleResponse } from "actions-on-google";
import { buildSimpleCard } from "../../../utils/responses";
import { YouTubeVideoServiceExt } from "../../../services/youtube-video-service";
import { EventService, EventServiceExt } from "../../../services/events-service";
import { Conversation } from "../../../utils/conversation";
// import { responseYouTubeVideoAsBsicCard, returnBasicCard } from '../responses';

export async function handleOption(conv, params, option) {
  const optionData = option;
  console.log("genericOptionData", optionData);
  const dfo = DialogflowOption.fromString(optionData);

  switch (dfo.type) {
    case "youtube#video":
      return handleVideo(conv, dfo);
    case "blogpost#id":
      return handleBlogpost(conv, dfo);
      case "event#id":
      return handleEvent(conv, dfo);
    case "person#name":
      return conv.ask(
        `${
          dfo.value
        } is a member of the Chrome Team. More information coming soon.`
      );
  }
  conv.ask("Sorry, I could not find it right now");
}

async function handleVideo(conv, dfo) {
  if (dfo && dfo.value) {
    const card = await YouTubeManager.getVideoById(dfo.value);
    if (card) {
      // responseYouTubeVideoAsBasicCard(conv, card); // TODO: check/verify
      conv.ask(
        new SimpleResponse({
          speech: "Here is a matching video",
          text: "Here is a matching video"
        })
      );

      const simpleCardResponse = buildSimpleCard(
        YouTubeVideoServiceExt.asCard(card)
      );
      conv.ask(simpleCardResponse);
      return;
    }
  }
  conv.ask("Sorry, I could not find the show on YouTube");
}

async function handleBlogpost(conv, dfo) {
  if (dfo && dfo.value) {
    const blogPostService = new BlogPostService(Firestore.db);
    const data = await blogPostService.getByKey(dfo.value);
    if (data) {
      const speech = `
      <speak>
        <p>
          <s>I've found a blog online.</s>
          <s>It's called ${data.title}.</s>
        </p>
      </speak>`;

      const displayText = "Here's a blog I found online";

      conv.ask(
        new SimpleResponse({
          speech: speech,
          text: displayText
        })
      );

      const simpleCardResponse = buildSimpleCard(
        BlogPostServiceExt.asCard(data)
      );
      conv.ask(simpleCardResponse);
      return;
    }
  }
  conv.ask("Sorry, I could not find the show on YouTube");
}

async function handleEvent(conv, dfo) {
  if (dfo && dfo.value) {
    const eventService = new EventService(Firestore.db);
    const data = await eventService.getEvent(dfo.value);
    if (data) {
      const speech = `
      <speak>
        <p>
          <s>${data.name} is a ${data.numberOfDays} day event.
          Is there anything else you'd like to know?</s>
        </p>
      </speak>`;

      const displayText = "Checkout these event details";

      const conversation = new Conversation(conv);

      conversation.addElement(
        new SimpleResponse({
          speech: speech,
          text: displayText
        })
      );

      const simpleCardResponse = buildSimpleCard( EventServiceExt.asCard(data) );
      conversation.addElement(simpleCardResponse);
      conversation.addSuggestions(['Show Keynotes', 'Show Summit Reports']);
      conversation.complete();
      return;
    }
  }
  conv.ask("Sorry, I could not find the event just now");
}
