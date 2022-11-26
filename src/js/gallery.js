import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api';
const FAIL_MESSAGE =
  'Sorry, there are no images matching your search query. Please try again.';
const END_OF_GALLERY_MESSAGE =
  "We're sorry, but you've reached the end of search results.";

const searchParams = new URLSearchParams({
  key: '31610284-d2a9adb661769c66f83a1d1f1',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
});

let pageCounter = 1;
let totalHits = 0;

const refs = {
  searchFormRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtnRef: document.querySelector('.load-more'),
};

refs.searchFormRef.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtnRef.addEventListener('click', onLoadMore);

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  resetGallery();
  resetPageCounter();
  const query = evt.currentTarget.elements.searchQuery.value.trim();
  if (query === '') {
    return;
  }
  setSearchQueryValue(query);
  fetchSearchQuery().then(data => {
    setTotalHits(data);
    createCardMarkup(data);
  });
}

function setSearchQueryValue(query) {
  searchParams.set('q', query);
}

async function fetchSearchQuery() {
  try {
    const response = await axios.get(`${BASE_URL}/?${searchParams}`);
    const data = await response.data;
    return data;
  } catch (error) {
    console.log('Error:', error.message);
  }
}

function createCardMarkup(data) {
  const array = data.hits;
  if (array.length === 0) {
    notifyOnFail();
    return;
  }
  drawMarkups(array);
}

function drawMarkups(array) {
  array.forEach(obj => {
    const markup = `<div class="gallery__item photo-card"><a class="gallery__link" href="${obj.largeImageURL}"><img class="gallery__image" src="${obj.webformatURL}" alt="${obj.tags}" loading="lazy" /><div class="info"><p class="info__item"><b>Likes</b><span class="info__data">${obj.likes}</span></p><p class="info__item"><b>Views</b><span class="info__data">${obj.views}</span></p><p class="info__item"><b>Comments</b><span class="info__data">${obj.comments}</span></p><p class="info__item"><b>Downloads</b><span class="info__data">${obj.downloads}</span></p></div></a></div>`;
    appendMarkupToGallery(markup);
  });
}

function appendMarkupToGallery(markup) {
  refs.galleryRef.insertAdjacentHTML('beforeend', markup);
}

function notifyOnFail() {
  Notiflix.Notify.failure(FAIL_MESSAGE, {
    timeout: 3000,
  });
}

function onLoadMore() {
  countTotalHits();
  if (totalHits <= 0) {
    notifyOnEnd();
    return;
  }
  countPage();
  setPageValue(pageCounter);
  fetchSearchQuery().then(createCardMarkup);
}

function notifyOnEnd() {
  Notiflix.Notify.info(END_OF_GALLERY_MESSAGE, {
    timeout: 3000,
  });
}

function setPageValue(number) {
  searchParams.set('page', number);
}

function getPerPageValue() {
  return searchParams.get('per_page');
}

function resetGallery() {
  refs.galleryRef.innerHTML = '';
}
function resetPageCounter() {
  pageCounter = 1;
}

function setTotalHits(data) {
  totalHits = data.totalHits;
}

function countPage() {
  pageCounter += 1;
}

function countTotalHits() {
  totalHits -= getPerPageValue();
  console.log(totalHits);
}

/* <div class="gallery__item photo-card">
  <a class="gallery__link" href="">
    <img class="gallery__image" src="./cat.jpg" alt="" loading="lazy" />
    <div class="info">
      <p class="info__item">
        <b>Likes</b>
        <span class="info__data">234</span>
      </p>
      <p class="info__item">
        <b>Views</b>
        <span class="info__data">234</span>
      </p>
      <p class="info__item">
        <b>Comments</b>
        <span class="info__data">234</span>
      </p>
      <p class="info__item">
        <b>Downloads</b>
        <span class="info__data">234</span>
      </p>
    </div>
  </a>
</div> */
