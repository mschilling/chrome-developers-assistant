export class Conversation {
  private _elements: any[];

  constructor(private conv) {
    this._elements = [];
  }

  addElement(element: any) {
    this._elements.push(element);
  }

  complete() {
    console.log('Finish conversation, #elements=' + this._elements.length)
    this._elements.forEach((elem) => this.conv.ask(elem));
  }

}
