class TalkAdminClass {
  api = null;

  constructor() {
    this.api = new ApiCallsClass();
    this.init();
  }

  init() {
    this.configureSave();
  }

  configureSave() {
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', () => this.handleSaveClick());
  }

  async handleSaveClick() {
    const saving = document.getElementById('saving');
    saving.classList.remove('hidden');

    const redirectCheckbox = document.getElementById('redirect-enabled');
    const splitTestCheckbox = document.getElementById('split-test-enabled');

    const redirectEnabledValue = redirectCheckbox.checked;
    const splitTestEnabledValue = splitTestCheckbox.checked;

    await this.saveData(redirectEnabledValue, splitTestEnabledValue);
    setTimeout(() => {
      saving.classList.add('hidden');
    }, 250, saving);
  }

  async saveData(redirect, splitTest) {
    const cacheBuster = (new Date()).getTime();
    const path = `${this.api.path}/post-admin-states?buster=${cacheBuster}`;
    const body = JSON.stringify({ redirect, splitTest });
    
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

  async getData() {
    const cacheBuster = (new Date()).getTime();
    const path = `${this.api.path}/get-admin-states?buster=${cacheBuster}`;
    
    try {
      const results = await axios.get(path, {
        headers: {
          'Content-Type': 'application/text',
          'x-api-key': this.api.key,
        },
      });
      return results.data;
    } catch (error) {
      console.log(error);
      return { redirect: 'false', splitTest: 'false' };
    }
  }

  placeData(data) {
    const redirectCheckbox = document.getElementById('redirect-enabled');
    const splitTestCheckbox = document.getElementById('split-test-enabled');

    const isRedirectOn = (data.redirect === 'true');
    const isSplitTestOn = (data.splitTest === 'true');

    redirectCheckbox.checked = isRedirectOn;
    splitTestCheckbox.checked = isSplitTestOn;
  }
}
