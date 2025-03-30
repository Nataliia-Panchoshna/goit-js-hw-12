import { fetchImages, addPage, resetPage } from './js/pixabay-api';
import { markup, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const box = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const form = document.querySelector('.form');
const input = document.querySelector('.search-input');
const loader = document.querySelector('.loader');

let currentQuery = '';
let page = 1;

loadMoreBtn.classList.add('hide');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (!inputValue) {
    showError(
      'Sorry, there are no images matching your search query. Please try again!'
    );
    return;
  }

  currentQuery = inputValue;
  clearGallery();
  page = resetPage();
  loadMoreBtn.classList.add('hide');

  await loadImages(currentQuery);
  input.value = '';
});

loadMoreBtn.addEventListener('click', async () => {
  page = addPage(page);
  await loadImages(currentQuery);
});

async function loadImages(query) {
  try {
    loader.classList.remove('hide');

    const data = await fetchImages(query, page);

    if (data.hits.length === 0 && data.totalHits === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    markup(data);

    if (data.hits.length < 15 || page * 15 >= data.totalHits) {
      loadMoreBtn.classList.add('hide');
      showError("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.classList.remove('hide');
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    showError(error.message);
  } finally {
    loader.classList.add('hide');
  }
}

function showError(message) {
  iziToast.error({ message });
}
