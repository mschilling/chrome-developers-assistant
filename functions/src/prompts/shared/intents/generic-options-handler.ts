import { Firestore } from './../../../shared/firestore';
import { BlogPostService } from './../../../services/blog-post-service';
import { YouTubeManager } from './../../../shared/youtube-manager';
import { DialogflowOption } from "../option-helper";
import { responseYouTubeVideoAsBasicCard, returnBasicCard } from '../responses';

export async function handleOption(conv, params, option) {
  const optionData = option;
  console.log('genericOptionData', optionData);
  const dfo = DialogflowOption.fromString(optionData);

  switch (dfo.type) {
    case 'youtube#video':
      return handleVideo(conv, dfo);
    case 'blogpost#id':
      return handleBlogpost(conv, dfo);
    case 'person#name':
      return conv.ask(`${dfo.value} is a member of the Chrome Team. More information coming soon.`);
  }
  conv.ask('Sorry, I could not find it right now');
}

async function handleVideo(conv, dfo) {
  if (dfo && dfo.value) {
    const card = await YouTubeManager.getVideoById(dfo.value);
    if (card) {
      responseYouTubeVideoAsBasicCard(conv, card); // TODO: check/verify
      return;
    }
  };
  conv.ask('Sorry, I could not find the show on YouTube');
}

async function handleBlogpost(conv, dfo) {
  if (dfo && dfo.value) {
    const blogPostService = new BlogPostService(Firestore.db);
    const data = await blogPostService.getByKey(dfo.value);
    if (data) {
      returnBasicCard(conv, 'blogpost', data);
      return;
    }
  };
  conv.ask('Sorry, I could not find the show on YouTube');
}
