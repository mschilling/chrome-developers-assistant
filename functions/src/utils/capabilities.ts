export class Capabilities {
  conv: any;
  hasScreen: boolean;
  hasAudio: boolean;
  hasMediaPlayback: boolean;
  hasWebBrowser: boolean;
  constructor(conv) {
    this.conv = conv;
    this.hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
    this.hasAudio = conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
    this.hasMediaPlayback = conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO');
    this.hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
  }

  func1() {
    this.conv.ask(`What's up?`);
  }
}
