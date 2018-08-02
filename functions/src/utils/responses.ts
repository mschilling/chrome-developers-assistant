import {
  Image,
  Carousel,
  BasicCard,
  Button,
  BrowseCarouselItem,
  BrowseCarousel
} from 'actions-on-google';
import { GenericCard } from '../models/card';
import { DialogflowOption } from '../prompts/shared/option-helper';

export function buildSimpleCard(item: GenericCard) {
  const card = new BasicCard({
    title: item.title,
    text: item.description,
    image: new Image({
      url: item.imageUrl,
      alt: item.imageAlt
    }),
    buttons: []
  });

  card.buttons = [
    new Button({
      url: item.buttonUrl,
      title: item.buttonTitle || item.title
    })
  ];

  return card;
}

export function buildCarousel(items: GenericCard[]) {
  if (items === null) {
    console.log('items is null');
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

export function buildBrowseCarousel(items: GenericCard[]) {
  if (items === null) {
    console.log('items is null');
    return null;
  }

  const options = buildBrowseCarouselOptions(items);
  return new BrowseCarousel({ items: options });
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

function buildBrowseCarouselOptions(cards: GenericCard[]) {
  console.log('browse carousel items', cards);

  const browseCarouselItems: BrowseCarouselItem[] = [];

  for (const card of cards) {
    const newOption = new BrowseCarouselItem({
      title: card.title,
      url: card.buttonUrl,
      description: card.description,
      image: new Image({
        url: card.imageUrl,
        alt: card.imageAlt
      })
    });

    browseCarouselItems.push(newOption);
  }
  return browseCarouselItems;
}
