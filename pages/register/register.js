class RegisterClass {
  api = null;

  imagePath = '';

  constructor() {
    this.api = new ApiCallsClass();
    setTimeout(() => {
      this.init();
    }, 500);
  }

  init() {
    this.configureSave();
  }

  configureSave() {
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', () => this.handleSaveClick());
  }

  selectImage(imagePath) {
    this.imagePath = imagePath;
  }

  async handleSaveClick() {
    const saving = document.getElementById('saving');
    saving.classList.remove('hidden');

    const userid = document.getElementById('userid');
    const email = document.getElementById('email');
    const banner = document.getElementById('banner-text');
    const imagePath = this.imagePath;

    const useridValue = userid.value;
    const emailValue = email.value;
    const bannerValue = banner.value;

    if (useridValue === '' || emailValue === '' || bannerValue === '') return;
    
    sessionStorage.setItem('userid', useridValue);
    await this.saveData(useridValue, emailValue, bannerValue, imagePath);
    setTimeout(() => {
      saving.classList.add('hidden');
      window.location.href = '/';
    }, 250, saving);
  }

  async saveData(username, email, bannerText, imagePath) {
    const cacheBuster = (new Date()).getTime();
    const path = `${this.api.path}/post-user-data?buster=${cacheBuster}`;
    const body = JSON.stringify({ username, email, bannerText, imagePath });
    
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
