class CookieClass {
  constructor() {
    this.init();
  }

  init() {
    const cookieString = this.getCookieValue('CloudflareDemo');
    const cookieData = JSON.parse(cookieString);
    this.displayCookieData(cookieData);
  }

  displayCookieData(data) {
    const city = document.getElementById('cookie-city');
    city.innerText = data.city;

    const state = document.getElementById('cookie-state');
    state.innerText = data.state;

    const zipcode = document.getElementById('cookie-zipcode');
    zipcode.innerText = data.zipcode;
  }

  getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) return match[2];
    return '';
  }
}

const cookies = new CookieClass();
