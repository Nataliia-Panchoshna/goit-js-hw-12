import axios from 'axios';

export let page = 1;
const perPage = 40;

export function resetPage() {
  page = 1;
}

export function addPage() {
  page += 1;
}

export async function fetchImages(query) {
  const API_KEY = '49078062-013dc20f7945f56078ec7160a';
  const urlParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 15,
  });
  const URL = `https://pixabay.com/api/?${urlParams}`;

  try {
    const { data, status } = await axios.get(URL);
    return data;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}