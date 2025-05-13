class ImageClass {
  #path = '/images/banners/'
  #images = [
    'banner-blue-circuit.webp',
    'banner-blue-snow.webp',
    'banner-green-circle.webp',
    'banner-green-square.webp',
    'banner-red-circle.webp',
    'banner-red-to-blue.webp',
  ];

  placeImages(id) {
    const wrapper = document.getElementById(id);

    const ids = [];
    this.#images.forEach((image, index) => {
      const innerImage = document.createElement('img');
      innerImage.src = `${this.#path}${image}`;
      innerImage.classList.add('core-image');
      
      const id = `image-${index}`;
      innerImage.id = id;
      ids.push(id);

      wrapper.appendChild(innerImage);
    });

    return ids;
  }

  selectImage(ids, selectedId) {
    ids.forEach((id) => {
      const innerImage = document.getElementById(id);
      innerImage.classList.remove('selected');
    });

    const selectedImage = document.getElementById(selectedId);
    selectedImage.classList.add('selected');
    return selectedImage.src;
  }
}