import { Image, Carousel, BasicCard, Button } from "actions-on-google";
import { GenericCard } from "../models/card";
import { DialogflowOption } from "../prompts/shared/option-helper";

export function buildSimpleCard(item: GenericCard) {

  return new BasicCard({
    title: item.title,
    text: item.description,
    buttons: new Button({ // TODO: make Button optional
      url: item.buttonUrl,
      title: item.buttonTitle
    }),
    image: new Image({
      url: item.imageUrl,
      alt: item.imageAlt
    })
  });
}

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
  const dfo = new DialogflowOption(card._optionType, card._optionValue, null);
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
