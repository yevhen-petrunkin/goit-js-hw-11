// import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEngine = {
  searchParams: new URLSearchParams({
    key: '31610284-d2a9adb661769c66f83a1d1f1',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  }),
  gallery: null,
  markup: '',
  pageCounter: 1,
  totalHits: 0,
  BASE_URL: 'https://pixabay.com/api',
  FAIL_MESSAGE:
    'Sorry, there are no images matching your search query. Please try again.',
  END_OF_GALLERY_MESSAGE:
    "We're sorry, but you've reached the end of search results.",

  drawMarkup(array) {
    return (this.markup = array
      .map(obj => {
        return `<a class="gallery__link" href="${obj.largeImageURL}">
  <img
    class="gallery__image"
    src="${obj.webformatURL}"
    alt="${obj.tags}"
    loading="lazy"
  />
  <div class="info">
    <p class="info__item">
      <b>Likes</b>
      <span class="info__data">${obj.likes}</span>
    </p>
    <p class="info__item">
      <b>Views</b>
      <span class="info__data">${obj.views}</span>
    </p>
    <p class="info__item">
      <b>Comments</b>
      <span class="info__data">${obj.comments}</span>
    </p>
    <p class="info__item">
      <b>Downloads</b>
      <span class="info__data">${obj.downloads}</span>
    </p>
  </div>
</a>
`;
      })
      .join(''));
  },

  enableLargeImagesInGallery() {
    this.gallery = new SimpleLightbox('.gallery a');
    this.gallery.on('show.simplelightbox', function (evt) {
      evt.preventDefault();
      if (!evt.target.classList.contains('gallery__image')) {
        return;
      }
    });
  },

  notifyOnNewQuery() {
    if (this.totalHits > 0) {
      const NEW_QUERY_MESSAGE = `Hooray! We found ${this.totalHits} images.`;
      Notiflix.Notify.success(NEW_QUERY_MESSAGE, {
        timeout: 3000,
      });
    }
  },

  notifyOnFail() {
    Notiflix.Notify.failure(this.FAIL_MESSAGE, {
      timeout: 3000,
    });
  },

  notifyOnEnd() {
    Notiflix.Notify.info(this.END_OF_GALLERY_MESSAGE, {
      timeout: 3000,
    });
  },

  countTotalHits() {
    this.totalHits -= this.getPerPageValue();
  },

  countPage() {
    this.pageCounter += 1;
    return this.pageCounter;
  },

  getPerPageValue() {
    return this.searchParams.get('per_page');
  },

  resetPageCounter() {
    this.pageCounter = 1;
    return this.pageCounter;
  },

  resetGalleryLightbox() {
    this.gallery.refresh();
  },

  setPageValue(number) {
    this.searchParams.set('page', number);
  },

  setSearchQueryValue(query) {
    this.searchParams.set('q', query);
  },

  setTotalHits(data) {
    this.totalHits = data.totalHits;
  },
};

export default galleryEngine;
