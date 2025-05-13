export class ProcessReplaceChange {
  value = '';

  constructor(value) {
    this.value = value;
    console.log('processReplaceChange', value);
  }

  element(element) {
    console.log(element, this.value);
    element.setInnerContent(this.value);
  }
}

export class ProcessAttributeChange {
  attribute = '';
  content = '';

  constructor(attribute, content) {
    this.attribute = attribute;
    this.content = content;
  }

  element(element) {
    element.setAttribute(this.attribute, this.content);
  }
}

export class ParamMapping {
  sets = [];

  constructor(urlObject) {
    this.init(urlObject);
  }

  init(urlObject) {
    const params = new URLSearchParams(urlObject.search);
    const paramStringLowercase = params.toString().toLowerCase();
    const paramPairsLowercase = paramStringLowercase.split('&');
    this.sets = paramPairsLowercase.map((param) => {
      const [key, value] = param.split('=');
      return { key, value };
    });
  }

  getKeys() {
    const keys = this.sets.map((set) => {
      return set.key;
    });
    return keys;
  }

  getValue(key) {
    const check = key.toLowerCase();
    const result = this.sets.find((set) => {
      return set.key === check;
    });
    if (result === undefined) return '';
    return result.value;
  }
}