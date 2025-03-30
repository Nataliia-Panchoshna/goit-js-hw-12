import axios from 'axios';

const API_KEY = '49078062-013dc20f7945f56078ec7160a';
const perPage = 15;

export function resetPage() {
  return 1;
}

export function addPage(currentPage) {
  return currentPage + 1;
}

export async function fetchImages(query, page) {
  const urlParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  });

  const URL = `https://pixabay.com/api/?${urlParams}`;

  try {
    const { data } = await axios.get(URL);
    return data;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}
