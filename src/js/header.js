'use strict';
import debounce from 'lodash.debounce';
import mainFunction from './coctails';
const coctailsList = document.querySelector('.coctails-section__coctails-list');

let arrayLength = 0;

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';
const DEBOUNCE_DELAY = 500;
const refs = {
  input: document.querySelector('.header-input'),
  btn: document.querySelector('.menu-batton'),
  mobileMenu: document.querySelector('.header-mobile-menu'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(evt) {
  let serchQuery = evt.target.value;
  fetch(`${BASE_URL}search.php?s=${serchQuery}`)
    .then(response => response.json())
    .then(response => {
      arrayLength = response.drinks.length;
      console.log(arrayLength);
      mainFunction(
        1,
        `${BASE_URL}search.php?s=${serchQuery}`,
        arrayLength,
        coctailsList
      );
    });

  // getCocktails(serchQuery)
  //   .then(data => console.log(data))
  //   .catch(erro => {
  //     console.log(erro);
  //   });
}

// function getCocktails(query) {
//   return fetch(`${BASE_URL}search.php?s=${query}`).then(response => {
//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }
//     return response.json();
//   });
// }
// ______________________________________________________
// menu btn
refs.btn.addEventListener('click', onClick);
function onClick() {
  const expanded = refs.btn.getAttribute('aria-expanded') === 'true' || false;

  refs.mobileMenu.classList.toggle('is-open');
  refs.btn.setAttribute('aria-expanded', !expanded);
}
