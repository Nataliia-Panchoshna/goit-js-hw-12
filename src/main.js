import { fetchImages, addPage, resetPage, page } from './js/pixabay-api'; 
import { markup, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const box = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const form = document.querySelector('.form');
const input = document.querySelector('.search-input');
const loader = document.querySelector('.loader');

let currentQuery = '';

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
  clearGallery(); // 🟢 Очищаємо галерею перед новим пошуком
  resetPage();
  loadMoreBtn.classList.add('hide');

  await loadImages(currentQuery);
  input.value = '';
});

loadMoreBtn.addEventListener('click', async () => {
  addPage();
  await loadImages(currentQuery);
});

async function loadImages(query) {
  try {
    loader.classList.remove('hide'); // 🟢 Використовуємо глобальну змінну loader без дублювання

    const data = await fetchImages(query);

    if (data.hits.length === 0 && data.totalHits === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    markup(data);

    // 🟢 Виправлена умова для кнопки "Load more"
    if (data.hits.length < 15 || (page * 15) >= data.totalHits) { 
      loadMoreBtn.classList.add('hide');
      showError("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.classList.remove('hide');
    }

    // 🟢 Захист від помилки, якщо `.gallery` порожня
    const firstElement = document.querySelector('.gallery').firstElementChild;
    if (firstElement) {
      const { height: cardHeight } = firstElement.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    showError(error.message);
  } finally {
    loader.classList.add('hide');
  }
}

function showError(message) {
  iziToast.error({ message });
}
