import { Suggestions } from "actions-on-google";

export class Conversation {
  private _elements: any[];
  private _suggestions: any[];

  constructor(private conv) {
    this._elements = [];
    this._suggestions = [];
  }

  addElement(element: any) {
    this._elements.push(element);
  }

  addSuggestion(text: string) {
    this._suggestions.push(text);
  }

  addSuggestions(texts: string[]) {
    this._suggestions.push(...texts);
  }

  complete() {
    console.log('Finish conversation, #elements=' + this._elements.length)
    this._elements.forEach((elem) => this.conv.ask(elem));

    //suggestions
    if(this._suggestions.length > 0) {
      this.conv.ask(new Suggestions(this._suggestions))
    }
  }

}
