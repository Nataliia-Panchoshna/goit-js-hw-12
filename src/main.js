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
const perPage = 15;

hideElement(loadMoreBtn);

form.addEventListener('submit', async event => {
  event.preventDefault();
  const inputValue = input.value.trim();

  if (!inputValue) {
    showError('Please enter a search term.');
    return;
  }

  currentQuery = inputValue;
  clearGallery();
  page = resetPage();
  hideElement(loadMoreBtn);

  await loadImages(currentQuery);
  input.value = '';
});

loadMoreBtn.addEventListener('click', async () => {
  page = addPage(page);
  await loadImages(currentQuery);
});

async function loadImages(query) {
  try {
    showElement(loader);

    const data = await fetchImages(query, page);

    if (data.hits.length === 0) {
      showError('Sorry, no images found. Try another search!');
      return;
    }

    markup(data);

    if (page * perPage >= data.totalHits) {
      hideElement(loadMoreBtn);
      showError("We're sorry, but you've reached the end of search results.");
    } else {
      showElement(loadMoreBtn);
    }

    scrollPage();
  } catch (error) {
    showError(`Error fetching images: ${error.message}`);
  } finally {
    hideElement(loader);
  }
}

function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    timeout: 3000,
  });
}

function showElement(element) {
  element.classList.remove('hide');
}

function hideElement(element) {
  element.classList.add('hide');
}

function scrollPage() {
  const firstCard = document.querySelector('.gallery')?.firstElementChild;
  if (firstCard) {
    const { height: cardHeight } = firstCard.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
