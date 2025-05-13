class IndexClass {
  api = null;
  apiCalledTimes = 0;

  constructor() {
    this.api = new ApiCallsClass();
    this.init();
  }

  init() {
    this.initActivePage();
    this.initUseridMonitoring();
  }

  #registered = '';
  initActivePage() {
    const registered = sessionStorage.getItem('userid');

    const registeredButton = document.getElementById('register-button');
    const useridButton = document.getElementById('userid-button');

    const cookieButton = document.getElementById('cookie');
    const redirectButton = document.getElementById('redirect');
    const splitTestButton = document.getElementById('split-test');

    const selectedRowsString = sessionStorage.getItem('selectedRows');
    if (selectedRowsString !== null) {
      const selectedRows = JSON.parse(selectedRowsString);
      this.#selectedRows = selectedRows;
    }

    if (registered !== null) {
      this.#registered = registered;
      registeredButton.classList.add('hidden');
      useridButton.classList.remove('hidden');

      const cacheBuster = (new Date()).getTime();

      useridButton.innerText = `User ID: ${registered}`;
      useridButton.setAttribute('href', `/pages/page/?page=${registered}&cache-buster=${cacheBuster}`);

      cookieButton.setAttribute('href', '/pages/cookie');
      redirectButton.setAttribute('href', `/pages/redirect/?page=${registered}&cache-buster=${cacheBuster}`);
      splitTestButton.setAttribute('href', `/pages/split-test/?page=${registered}&cache-buster=${cacheBuster}`);
    } else {
      cookieButton.setAttribute('disabled', 'true');
      cookieButton.setAttribute('href', '/');
      
      redirectButton.setAttribute('disabled', 'true');
      redirectButton.setAttribute('href', '/');

      splitTestButton.setAttribute('disabled', 'true');
      splitTestButton.setAttribute('href', '/');
    }
  }

  initUseridMonitoring() {
    const refreshUpper = document.getElementById('refresh-upper');
    const refreshLower = document.getElementById('refresh-lower');

    refreshUpper.addEventListener('click', this.monitor.bind(this));
    refreshLower.addEventListener('click', this.monitor.bind(this));
  }

  #data = [];
  async monitor() {
    const attach = document.getElementById('attach-active-userids');
    const data = await this.getData();
    this.#data = data;
    console.log(data);

    this.apiCalledTimes++;
    if (data.length === 0) {
      attach.innerHTML = `<div class="core-note core-margin-bottom" id="issue">No Records Listed (refresh x${this.apiCalledTimes}).</div>`;
    } else {
      this.showData(attach, data);
    }
  }

  async getData() {
    const cacheBuster = (new Date()).getTime();
    const path = `${this.api.path}/get-users-registered-today?buster=${cacheBuster}`;

    try {
      const results = await axios.get(path, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.api.key,
        },
      });
      return results.data;
    } catch (error) {
      console.log(error);
    }
  }

  showData(attach, data) {
    const wrapper = document.createElement('div');
    const note = '<div class="core-note">Once a second selection is made, the Split Test is stored.</div>';
    const table = `
      <table class="core-table">
        <thead>
          <tr>
            <th>Select 2</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${this.generateRows(data)}
        </tbody>
      </table>
    `;
    wrapper.innerHTML = note + '\n' + table;
    attach.replaceChildren(wrapper);
  }

  generateRows(data) {
    return data.map((row, index) => `
      <tr>
        <td>
          ${this.getButton(index)}
        </td>
        <td>
          <div>User ID: ${row.username}</div>
          <div>IP: ${row.ip}</div>
          <div>Banner: ${row.banner}</div>
        </td>
      </tr>
    `).join('');
  }

  getButton(rowIndex) {
    if (['', null].includes(this.#registered)) return '<span>REGISTER</span>';

    if (this.#data[rowIndex].username === this.#registered) {
      return '<span>YOU!</span>';
    } else {
      if (this.#selectedRows.includes(rowIndex)) {
        return 'SELECTED';
      } else if (this.#selectedRows.length < 2) {
        return `<button onclick="indexHandler.clickRow(${rowIndex})">SELECT</button>`;
      } else {
        return 'NOT-SELECTED'
      }
    }
  }

  #selectedRows = [];
  clickRow(rowIndex) {
    if (this.#selectedRows.length >= 2) return;
    if (this.#selectedRows.includes(rowIndex)) return;

    this.#selectedRows.push(rowIndex);
    sessionStorage.setItem('selectedRows', JSON.stringify(this.#selectedRows));

    if (this.#selectedRows.length === 2) {
      const key = this.#registered;
      const baseUrl = location.protocol + '//' + location.hostname;

      const split1 = this.generateUrl(baseUrl, this.#data[this.#selectedRows[0]].username);
      const split2 = this.generateUrl(baseUrl, this.#data[this.#selectedRows[1]].username);

      const redirects = [
        { percent: 50, url: split1, },
        { percent: 50, url: split2, },
      ];

      this.saveRecords({ key, redirects });
    }
  }

  generateUrl(baseUrl, vanity) {
    return `${baseUrl}/pages/page/?page=${vanity}`;
  }

  async saveRecords(records) {
    const cacheBuster = (new Date()).getTime();
    const path = `${this.api.path}/post-user-split-test?buster=${cacheBuster}`;
    const body = JSON.stringify({ ...records });
    
    try {
      await axios.post(path, body, {
        headers: {
          'Content-Type': 'application/text',
          'x-api-key': this.api.key,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const indexHandler = new IndexClass();
