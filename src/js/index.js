import Search from './models/search';
import Recipe from './models/recipe';
import List from './models/list';
import Likes from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {};
window.state = state;

// -----------begin---Search controller-------

const controlSearch = async () => {
  const query = searchView.getInput();
  //const query = 'pizza';
  if (query) {
    state.search = new Search(query);

    searchView.clearInput();

    searchView.clearResults();

    renderLoader(elements.searchRes);

    try {
      await state.search.getResults();

      searchView.renderResults(state.search.result);

      clearLoader();
    } catch {
      alert('Something went wrong :( \n\n Try some different key words!');
    }
  }
};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (event) => {
  searchView.clearButtons();
  const btn = event.target.closest('.btn-inline');
  if (btn) {
    const page = parseInt(btn.dataset.goto, 10);
    searchView.renderResults(state.search.result, page);
  }
});

// ----------End--------Search controller-------------

// ----------Begin--------Recipe controller-------------

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    state.recipe = new Recipe(id);
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    if (state.search) searchView.highlightSelected(id);
    //window.r =  state.recipe; // for testing purposes

    try {
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();

      state.recipe.clacTime();

      state.recipe.calcServings();

      clearLoader();

      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert('Something went wrong :(');
    }
  }
};

//['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));
['hashchange'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

//-----------list-controller------------------------------------------

const controlList = () => {
  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};
//----------end of list-controller------------------------------------------

//-------------handle delete and update list item events--------------

elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  ///delete item from list///////
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  }
  //---------------- handle the count----------------------
  else if (e.target.matches('shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, value);
  }
});
//-----------end of handle delete and update list item events--------------

//---------------------Like controller-------------------------------------
//testing
//  state.likes = new Likes();
//  likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  if (!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    likesView.toggleLikeBtn(true);
    likesView.renderLike(newLike);
  } else {
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//-------- Restore liked recipes on page load----------------------------

window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();

  likesView.toggleLikeMenu(state.likes.getNumLikes());

  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//------end of Restore liked recipes on page load----------------------------

//-----------------End of Like controller-------------------------------------

//---------------- Handling recipe buttons-----------------------------

elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // like controller
    controlLike();
  }
});
// ----------End--------Recipe controller-------------

//-------------------shopping-list controller-----------

// window.l = new list();

//-------------------shopping-list controller-----------
