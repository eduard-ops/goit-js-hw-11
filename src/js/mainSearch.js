import GalleryApiService from './components/galleryApi';

import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

import galleryTpl from '../templates/gallery.hbs';

const refs = {
  formEl: document.querySelector('#search-form'),
  btnSubmit: document.querySelector('.btn-submit'),
  divGallery: document.querySelector('.gallery'),
  brtMore: document.querySelector('.btn__load-more'),
};

refs.brtMore.classList.add('is-hidden');

const galleryApiService = new GalleryApiService();

refs.formEl.addEventListener('submit', onClickSubmit);
refs.brtMore.addEventListener('click', onLoadMore);

async function onClickSubmit(e) {
  e.preventDefault();
  clearHitsContainer();
  refs.brtMore.classList.add('is-hidden');
  galleryApiService.query = e.currentTarget.elements.searchQuery.value;
  if (galleryApiService.query === '') {
    Notiflix.Notify.info('Please enter something');
    return;
  }
  galleryApiService.resetPage();
  try {
    const urlObj = await galleryApiService.fetchGallery();
    const { data } = urlObj;
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
    refs.brtMore.classList.remove('is-hidden');
    appendHitsMarkup(data.hits);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

async function onLoadMore() {
  const urlObj = await galleryApiService.fetchGallery();
  const {
    data: { hits },
  } = urlObj;
  appendHitsMarkup(hits);
  lightbox.refresh();
  const { height: cardHeight } = refs.divGallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function appendHitsMarkup(hits) {
  refs.divGallery.insertAdjacentHTML('beforeend', galleryTpl(hits));
}

function clearHitsContainer() {
  refs.divGallery.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
