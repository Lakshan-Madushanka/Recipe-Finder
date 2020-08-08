import axios from 'axios';
import { keyAPI, axiosheader, proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        // https://www.food2fork.com/api/search?key=${keyAPI}&q=${this.query}` No longer working
        `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`,
        axiosheader
      );
      this.result = res.data.recipes;
    } catch (error) {
      // alert(error + '\n\n Try some dofferent key words!');
    }
  }
}
