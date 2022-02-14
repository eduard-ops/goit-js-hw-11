const axios = require('axios');
const BAZE_URL = 'https://pixabay.com/api/';
const API_KEY = '25658613-98e642d2c9015137af6c2464f';

export default class GalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchGallery() {
    // console.log(this);
    const url = await axios.get(
      `${BAZE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`,
    );
    const data = await url;
    if (!data.data.hits.length) {
      throw new Error(hits.status);
    }
    this.incrementPage();

    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQueery) {
    this.searchQuery = newQueery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
