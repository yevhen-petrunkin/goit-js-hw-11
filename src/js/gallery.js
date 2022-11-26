const BASE_URL = 'https://pixabay.com/api';
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

const refs = {
  searchFormRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtnRef: document.querySelector('.load-more'),
};

refs.searchFormRef.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtnRef.addEventListener('click', onLoadMore);

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  const query = evt.currentTarget.elements.searchQuery.value.trim();
  if (query === '') {
    return;
  }
  setSearchQueryValue(query);
  fetchSearchQuery();
}

function setSearchQueryValue(query) {
  searchParams.set('q', query);
}

function fetchSearchQuery() {
  fetch(`${BASE_URL}/?${searchParams}`)
    .then(r => r.json())
    .then(createCardMarkup);
}

function createCardMarkup(data) {
  const array = data.hits;
  array.forEach(obj => {
    const markup = `<div class="gallery__item photo-card"><a class="gallery__link" href="${obj.largeImageURL}"><img class="gallery__image" src="${obj.webformatURL}" alt="${obj.tags}" loading="lazy" /><div class="info"><p class="info__item"><b>Likes</b><span class="info__data">${obj.likes}</span></p><p class="info__item"><b>Views</b><span class="info__data">${obj.views}</span></p><p class="info__item"><b>Comments</b><span class="info__data">${obj.comments}</span></p><p class="info__item"><b>Downloads</b><span class="info__data">${obj.downloads}</span></p></div></a></div>`;
    refs.galleryRef.insertAdjacentHTML('beforeend', markup);
  });
}

function onLoadMore() {
  pageCounter += 1;
  setPageValue(pageCounter);
  fetchSearchQuery();
}

function setPageValue(number) {
  searchParams.set('page', number);
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
