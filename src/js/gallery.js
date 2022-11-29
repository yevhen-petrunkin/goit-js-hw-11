import axios from 'axios';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import galleryEngine from './gallery-engine.js';

// const searchParams = new URLSearchParams({
//   key: '31610284-d2a9adb661769c66f83a1d1f1',
//   q: '',
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
//   page: 1,
//   per_page: 40,
// });

// let gallery = null;
// let markup = '';
// let pageCounter = 1;
// let totalHits = 0;
// const BASE_URL = 'https://pixabay.com/api';
// const FAIL_MESSAGE =
//   'Sorry, there are no images matching your search query. Please try again.';
// const END_OF_GALLERY_MESSAGE =
//   "We're sorry, but you've reached the end of search results.";

let observer = new IntersectionObserver(onEntry, {
  rootMargin: '300px',
});

const refs = {
  searchFormRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  triggerRef: document.querySelector('.trigger'),
};

observer.observe(refs.triggerRef);

refs.searchFormRef.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  resetGallery();
  galleryEngine.resetPageCounter();
  galleryEngine.setPageValue(galleryEngine.pageCounter);
  const query = evt.currentTarget.elements.searchQuery.value.trim();
  if (query === '') {
    return;
  }
  galleryEngine.setSearchQueryValue(query);
  fetchSearchQuery();
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !galleryEngine.totalHits <= 0) {
      onLoadMore();
    }
  });
}

function onLoadMore() {
  if (galleryEngine.markup !== '') {
    galleryEngine.countTotalHits();
    if (galleryEngine.totalHits <= 0) {
      galleryEngine.notifyOnEnd();
      return;
    }
    galleryEngine.countPage();
    galleryEngine.setPageValue(galleryEngine.pageCounter);
    fetchSearchQuery();
  }
}

async function fetchSearchQuery() {
  try {
    const response = await axios.get(
      `${galleryEngine.BASE_URL}/?${galleryEngine.searchParams}`
    );
    const data = await response.data;
    if (galleryEngine.pageCounter === 1) {
      galleryEngine.setTotalHits(data);
    }
    createCardMarkup(data);
    if (galleryEngine.pageCounter === 1) {
      galleryEngine.enableLargeImagesInGallery();
      galleryEngine.notifyOnNewQuery();
    }
    if (galleryEngine.pageCounter !== 1) {
      galleryEngine.resetGalleryLightbox();
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

function createCardMarkup(data) {
  const array = data.hits;
  if (array.length === 0) {
    galleryEngine.notifyOnFail();
    return;
  }
  galleryEngine.drawMarkup(array);
  appendMarkupToGallery(galleryEngine.markup);
}

function appendMarkupToGallery(markup) {
  refs.galleryRef.insertAdjacentHTML('beforeend', markup);
}

function resetGallery() {
  galleryEngine.totalHits = 0;
  refs.galleryRef.innerHTML = '';
}

// function drawMarkup(array) {
//   return (markup = array
//     .map(obj => {
//       return `<a class="gallery__link" href="${obj.largeImageURL}">
//   <img
//     class="gallery__image"
//     src="${obj.webformatURL}"
//     alt="${obj.tags}"
//     loading="lazy"
//   />
//   <div class="info">
//     <p class="info__item">
//       <b>Likes</b>
//       <span class="info__data">${obj.likes}</span>
//     </p>
//     <p class="info__item">
//       <b>Views</b>
//       <span class="info__data">${obj.views}</span>
//     </p>
//     <p class="info__item">
//       <b>Comments</b>
//       <span class="info__data">${obj.comments}</span>
//     </p>
//     <p class="info__item">
//       <b>Downloads</b>
//       <span class="info__data">${obj.downloads}</span>
//     </p>
//   </div>
// </a>;
// `;
//     })
//     .join(''));
// }

// function countPage() {
//   pageCounter += 1;
//   return pageCounter;
// }

// function setPageValue(number) {
//   searchParams.set('page', number);
// }

// function resetPageCounter() {
//   pageCounter = 1;
//   return pageCounter;
// }

// function setTotalHits(data) {
//   galleryEngine.totalHits = data.totalHits;
// }

// function notifyOnNewQuery() {
//   if (totalHits > 0) {
//     const NEW_QUERY_MESSAGE = `Hooray! We found ${totalHits} images.`;
//     Notiflix.Notify.success(NEW_QUERY_MESSAGE, {
//       timeout: 3000,
//     });
//   }
// }

// function setSearchQueryValue(query) {
//   searchParams.set('q', query);
// }

// async function fetchSearchQuery() {
//   try {
//     const response = await axios.get(`${BASE_URL}/?${searchParams}`);
//     const data = await response.data;
//     if (pageCounter === 1) {
//       setTotalHits(data);
//     }
//     createCardMarkup(data);
//     if (pageCounter === 1) {
//       enableLargeImagesInGallery();
//       notifyOnNewQuery();
//     }
//     if (pageCounter !== 1) {
//       resetGalleryLightbox();
//     }
//   } catch (error) {
//     console.log('Error:', error.message);
//   }
// }

// function enableLargeImagesInGallery() {
//   gallery = new SimpleLightbox('.gallery a');
//   gallery.on('show.simplelightbox', function (evt) {
//     evt.preventDefault();
//     if (!evt.target.classList.contains('gallery__image')) {
//       return;
//     }
//   });
// }

// function resetGalleryLightbox() {
//   gallery.refresh();
// }

// function notifyOnFail() {
//   Notiflix.Notify.failure(FAIL_MESSAGE, {
//     timeout: 3000,
//   });
// }

// function notifyOnEnd() {
//   Notiflix.Notify.info(END_OF_GALLERY_MESSAGE, {
//     timeout: 3000,
//   });
// }

// function getPerPageValue() {
//   return searchParams.get('per_page');
// }
