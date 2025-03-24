import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const box = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function markup(data) {
  const { hits } = data;
  if (!hits.length) return; // Если данных нет - ничего не делаем

  const markup = hits
    .map(image => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
        <li class="gallery-item">
          <a href="${largeImageURL}" class="gallery-link">
            <img src="${webformatURL}" alt="${tags}" />
            <div class="info">
              <p>Likes: ${likes}</p>
              <p>Views: ${views}</p>
              <p>Comments: ${comments}</p>
              <p>Downloads: ${downloads}</p>
            </div>
          </a>
        </li>`;
    })
    .join('');

  box.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}