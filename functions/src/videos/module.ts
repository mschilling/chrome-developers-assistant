// app.intent(Actions.INTENT_VIDEO_SEARCH, searchVideos);
// app.intent(Actions.INTENT_VIDEO_RECOMMEND, videoRecommendationHandler);

export class VideosModule {
  static mapIntents(app) {
    app.intent('INTENT NAME', (conv, params) => {
      //
    });
  }
}
