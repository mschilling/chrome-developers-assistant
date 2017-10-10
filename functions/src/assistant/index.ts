import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ApiAiApp, RequestHandler, Responses } from 'actions-on-google-ts'

/**
 * The entry point to handle a http request
 * @param {Request} request An Express like Request object of the HTTP request
 * @param {Response} response An Express like Response object to send back data
 */
export const listener = functions.https.onRequest(async (request, response) => {
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);

  const app = new ApiAiApp({request, response});
  const actionMap = new Map();
  
  // actionMap.set(app.StandardIntents.MAIN, () => {
  //     const richResponse: any = app.buildRichResponse()
  //       .addSimpleResponse('Hello Webhook')
  //       .addSuggestions(['foo', 'bar']);
  //     app.ask(richResponse);

  // });
  // app.handleRequest(actionMap);

  const richResponse: any = app.buildRichResponse()
    .addSimpleResponse('Hello Webhook')
    .addSuggestions(['foo', 'bar']);
  app.ask(richResponse);
})
