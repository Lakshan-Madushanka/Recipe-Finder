import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
};

/*const limitRecepeTitle = (title, limit = 17) => {

    const newTitle = [];
    
    if(title.length > 17) {

        title.split(" ").reduce((acc, cur) => {

            if(acc + cur.length <= limit) {
                newTitle.push(cur);
                
            }
                return acc + cur.length;
        },0)

        
        return `${newTitle.join(" ")} ...`;
    }

    return title;
}
*/

export const highlightSelected = (id) => {
  const resultArray = Array.from(document.querySelectorAll('.results__link'));
  resultArray.forEach((el) => {
    el.classList.remove('results__link--active');
  });
  document
    .querySelector(`.results__link[href*="#${id}"]`)
    .classList.add('results__link--active');
};

export const limitRecepeTitle = (title, limit = 17) => {
  const newTitle = [];
  let titleArray = title.split(' ');

  if (title.length > 17 && titleArray[0].length <= 17) {
    titleArray.reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }

  if (titleArray[0].length >= 17) {
    return title.substring(0, 17) + '...';
  }
  return title;
};

const recipe = (el) => {
  const markup = `
<li>
    <a class="results__link" href="#${el.recipe_id}">
        <figure class="results__fig">
            <img src="${el.image_url}" alt="${el.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecepeTitle(el.title)}</h4>
            <p class="results__author">${el.publisher}</p>
        </div>
    </a>
</li>
`;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const clearButtons = () => {
  elements.searchResPages.innerHTML = '';
};

const createButton = (page, type) => `

        <button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === 'prev' ? 'left' : 'right'
            }"></use>
        </svg>
        <span>page ${type === 'prev' ? page - 1 : page + 1}</span>
        </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  if (page === 1 && page < pages) {
    button = createButton(page, 'next');
  } else if (page < pages) {
    button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
  } else if (page === pages) {
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  if (recipes === undefined) {
    //alert('Error ocuured while getting data from the server !');
    location.reload(true);
  }
  const start = (page - 1) * resPerPage;
  const end = page * 10;
  recipes.slice(start, end).forEach(recipe);

  renderButtons(page, recipes.length, resPerPage);
};
