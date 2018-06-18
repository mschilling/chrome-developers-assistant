import { Image, Carousel } from "actions-on-google";
import { GenericCard } from "../models/card";
import { DialogflowOption } from "../prompts/shared/option-helper";

export function buildCarousel(items: GenericCard[]) {
  if (items === null) {
    console.log("items is null");
    return null;
  }

  let countOptions = 0;
  let options = {};
  for (const item of items) {
    if (item.imageUrl) {
      countOptions++;
      const option = buildCarouselOption(item);
      options = { ...options, ...option };

      if (countOptions >= 10) {
        break;
      }
    }
  }
  return new Carousel({ items: options });
}

function buildCarouselOption(card: GenericCard) {
  const dfo = new DialogflowOption("person#name", card.title, null);
  return {
    [dfo.toString()]: {
      synonyms: [card.title],
      title: card.title,
      description: card.description,
      image: new Image({
        url: card.imageUrl,
        alt: card.imageAlt
      })
    }
  };
}
