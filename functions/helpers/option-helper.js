'use strict';

class DialogflowOptionHelper {
  constructor( objectType, objectValue, action) {
    this.type = objectType;
    this.value = objectValue;
    this.action = action;
  }

  static fromString( stringValue ) {
    const obj = JSON.parse(stringValue);
    return new DialogflowOption(obj.type, obj.value, obj.action);
  }

  toString() {
    return JSON.stringify(this);
  }
}

module.exports = DialogflowOptionHelper;
