import * as util from 'util';
import { DialogflowConversation, Contexts } from 'actions-on-google';
import { Translations as Strings } from './../translations';

import { PeopleService } from '../../../services/people-service';
import { Firestore } from '../../../shared/firestore';
import { VideoService } from '../../../services/video-service';
import { responseVideoResults } from '../../videos/responses';

const peopleService = new PeopleService(Firestore.db);

const SPEAKER_PARAM = 'speaker';

export async function speakerVideosIntent(
  conv: DialogflowConversation<{}, {}, Contexts>,
  params
) {
  console.log(`[SPEAKER] [speaker_intent] [query=${conv.query}] [params=${JSON.stringify(params)}]`);

  const speakerKey = params[SPEAKER_PARAM];
  const person = await peopleService.getPerson(speakerKey);

  if (!person) {
    conv.ask(util.format(Strings.PersonNoInfo, speakerKey));
  }

  const videoService = new VideoService(Firestore.db);
  const videos = await videoService.search({ speakers: [speakerKey] }, 10);
  responseVideoResults(conv, videos);
}
