import * as util from 'util';
import {
  DialogflowConversation,
  Contexts,
  SimpleResponse
} from 'actions-on-google';
import { Translations as Strings } from './../translations';

import {
  PeopleService,
  PeopleServiceExt
} from '../../../services/people-service';
import { Firestore } from '../../../shared/firestore';
import { VideoService } from '../../../services/video-service';
import { responseVideoResults } from '../../videos/responses';
import { buildSimpleCard } from '../../../utils/responses';
import { Parameters } from '../../../dialogflow-constants';

const peopleService = new PeopleService(Firestore.db);

export async function speakerIntent(
  conv: DialogflowConversation<{}, {}, Contexts>,
  params
) {
  console.log(
    `[SPEAKER] [speaker_intent] [query=${conv.query}]` +
      ` [params=${JSON.stringify(params)}]`
  );

  const key = params[Parameters.SPEAKER];
  if (!key) {
    conv.ask(util.format(Strings.PersonNoInfo, key));
  }

  const person = await peopleService.getPerson(key);
  if (person) {
    let speechText = util.format(
      Strings.PersonDefaultWhoIs,
      `${person.first_name} ${person.last_name}`
    );
    if (person.short_bio) {
      speechText = person.short_bio;
    }

    const speech = `<speak>${speechText}</speak>`;

    conv.ask(
      new SimpleResponse({
        speech: speech,
        text: speechText
      })
    );

    const simpleCardResponse = buildSimpleCard(PeopleServiceExt.asCard(person));
    conv.ask(simpleCardResponse);
  } else {
    conv.ask(util.format(Strings.PersonNoInfo, person));
  }
}

export async function speakerVideosIntent(
  conv: DialogflowConversation<{}, {}, Contexts>,
  params
) {
  console.log(
    `[SPEAKER] [speaker_videos_intent] [query=${conv.query}]` +
      ` [params=${JSON.stringify(params)}]`
  );

  const speakerKey = params[Parameters.SPEAKER];
  const person = await peopleService.getPerson(speakerKey);

  if (!person) {
    conv.ask(util.format(Strings.PersonNoInfo, speakerKey));
  }

  const videoService = new VideoService(Firestore.db);
  const videos = await videoService.search({ speakers: [speakerKey] }, 10);
  responseVideoResults(conv, videos);
}
