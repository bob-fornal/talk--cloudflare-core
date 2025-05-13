class PageClass {
  pageId = '';

  constructor() {
    this.init();
  }

  init() {
    this.getPathname();
  }

  getPathname() {
    const urlParams = window.location.search;
    const params = new URLSearchParams(urlParams);
    const page = params.get('page');
  }
}

const page = new PageClass();