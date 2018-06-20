import { YouTubeVideo } from '../models/youtube-video';
import { GenericCard } from '../models/card';

export class YouTubeVideoServiceExt {

  static asCards(items: YouTubeVideo[]): GenericCard[] {
    if (items === null) {
      console.log("items is null");
      return [];
    }
    return items.map(p => YouTubeVideoServiceExt.asCard(p));
  }

  static asCard(item: YouTubeVideo): GenericCard {
    const thumbId = String(Math.ceil(Math.random() * 3));

    const card = new GenericCard();
    card._id = item.id;
    card.title = item.title;
    card.description = item.description;
    card.imageUrl = `https://img.youtube.com/vi/${item.videoId}/hq${thumbId}.jpg`;
    card.imageAlt = card.title;
    card.buttonUrl = 'https://youtube.com/watch?v=' + item.videoId;
    card.buttonTitle = 'Watch on YouTube';
    card._optionType = item.kind;
    card._optionValue = item.videoId;
    return card;
  }

}
