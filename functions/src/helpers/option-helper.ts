export class DialogflowOptionHelper {
  type;
  value;
  action;

  constructor( objectType, objectValue, action) {
    this.type = objectType;
    this.value = objectValue;
    this.action = action;
  }

  static fromString( stringValue ) {
    const obj = JSON.parse(stringValue);
    return new DialogflowOptionHelper(obj.type, obj.value, obj.action);
  }

  toString() {
    return JSON.stringify(this);
  }
}
