'use strict';

const coctailsList = document.querySelector('.coctails-section__coctails-list');
const coctailsSection = document.querySelector('.coctails-section');
const coctailModal = document.querySelector('.coctails-section__coctail-modal');
// проверяем есть ли в памяти коктейли

let favoriteCoctails = [];
try {
  if (JSON.parse(localStorage.getItem('favoriteCoctails')).length !== 0) {
    favoriteCoctails = JSON.parse(localStorage.getItem('favoriteCoctails'));
  }
} catch {}

// считаем количество коктейлей,
// которые нужно отрисовать в зависимости от разрешения экрана

let coctailsAmount = 0;
const coctailsSectionStyles = getComputedStyle(coctailsSection);
if (coctailsSectionStyles.width === '320px') {
  coctailsAmount = 3;
} else if (coctailsSectionStyles.width === '768px') {
  coctailsAmount = 6;
} else {
  coctailsAmount = 9;
}

// дальше черная магия.
// цикл делает столько итераций, сколько нужно отрисовать коктейлей
// НАЧАЛО ЦИКЛА
for (let i = 0; i < coctailsAmount; i += 1) {
  // функция фетча коктейлей
  const fetchCoctail = async () => {
    const response = await fetch(
      'https://www.thecocktaildb.com/api/json/v1/1/random.php'
    );
    const coctails = await response.json();
    return coctails;
  };
  // вызов функции фетча коктейлей
  fetchCoctail()
    .then(coctails => {
      const {
        strDrinkThumb,
        strDrink,
        strInstructions,
        strIngredient1,
        strIngredient2,
        strIngredient3,
        strIngredient4,
        strIngredient5,
        strIngredient6,
        strIngredient7,
        strIngredient8,
        strIngredient9,
        strIngredient10,
        strIngredient11,
        strIngredient12,
        strIngredient13,
        strIngredient14,
        strIngredient15,
      } = coctails.drinks[0];
      console.log(coctails.drinks[0]);
      // проверяем есть ли коктейль текущей итерации в исписке избранных коктейлей
      try {
        if (
          JSON.parse(localStorage.getItem('favoriteCoctails')).includes(
            strDrink
          )
        ) {
          // если коктейль текущей итерации есть в исписке избранных коктейлей
          // то добавляем разметку с коктейлем из текущей итерации цикла
          //с кнопкой "убрать из избранного"
          coctailsList.innerHTML += `<li class='coctails-section__coctail'>
            <div class='coctails-section__coctail-container'>
                <img class='coctails-section__coctail-img' srcset="${strDrinkThumb}" alt="${strDrink}">
                <h3 class='coctails-section__coctail-name'>${strDrink}</h3>
                <div class="coctails-section__coctail-buttons-container">
                    <button class="coctails-section__button coctails-section__learn-button">Learn more</button>
                    <button class="coctails-section__button coctails-section__dislike-button">Remove</button>
                </div>
            </div>
        </li>`;
        }
        // если коктейля текущей итерации нет в исписке избранных коктейлей
        // то добавляем разметку с коктейлем из текущей итерации цикла
        //с кнопкой "добавить в избранное"
        else {
          coctailsList.innerHTML += `<li class='coctails-section__coctail'>
            <div class='coctails-section__coctail-container'>
                <img class='coctails-section__coctail-img' srcset="${strDrinkThumb}" alt="${strDrink}">
                <h3 class='coctails-section__coctail-name'>${strDrink}</h3>
                <div class="coctails-section__coctail-buttons-container">
                    <button class="coctails-section__button coctails-section__learn-button" type="button">Learn more</button>
                    <button class="coctails-section__button coctails-section__like-button" type="button">Add to</button>
                </div>
            </div>
        </li>`;
        }
      } catch {}
      // выбираем все созданные карточки коктейлей(вне зависимости от итерации)
      const coctailCards = document.querySelectorAll(
        '.coctails-section__coctail-container'
      );
      //вешаем слушателя события на все КАРТОЧКИ(именно на карточки)
      coctailCards.forEach(elem => {
        elem.addEventListener('click', event => {
          const currentCocktailName = event.currentTarget.querySelector(
            '.coctails-section__coctail-name'
          ).textContent;
          // если событие словилось на кнопке "добавить в избранное",
          // то добавляем в память массив с названиями избранных коктейлей
          // и меняем кнопку на "убрать из избранного"
          if (
            event.target.classList.contains('coctails-section__like-button')
          ) {
            event.target.textContent = 'Remove';
            favoriteCoctails.push(currentCocktailName);
            localStorage.setItem(
              'favoriteCoctails',
              JSON.stringify(favoriteCoctails)
            );
            event.target.classList.toggle('coctails-section__dislike-button');
            event.target.classList.toggle('coctails-section__like-button');
            // если событие словилось на кнопке "убрать из избранного",
            // то добавляем в память массив с названиями избранных коктейлей,
            // из которых предварительно удаляем коктейль, на кнопке которого словилось событие
            // и меняем кнопку на "добавить в избранное"
          } else if (
            event.target.classList.contains('coctails-section__dislike-button')
          ) {
            event.target.textContent = 'Add to';
            favoriteCoctails.splice(
              favoriteCoctails.indexOf(currentCocktailName),
              1
            );
            localStorage.setItem(
              'favoriteCoctails',
              JSON.stringify(favoriteCoctails)
            );
            event.target.classList.toggle('coctails-section__dislike-button');
            event.target.classList.toggle('coctails-section__like-button');
          } else if (
            event.target.classList.contains('coctails-section__learn-button')
          ) {
            coctailModal.classList.remove(
              'coctails-section__coctail-modal--is-hidden'
            );
            coctailModal.innerHTML = `<h3 class = "coctail-modal__coctail-name" >${strDrink}</h3>
      <h4 class = "coctail-modal__coctail-description">Instractions:</h4>
      <p class = "coctail-modal__coctail-instruction">${strInstructions}</p>
      <img class='coctails-section__coctail-img' src="${strDrinkThumb}" alt="${strDrink}">
      <h4 class = "coctail-modal__coctail-description">Ingredients</h4>
      <p>Per cocktail</p>
      <ul class = "coctail-modal__ingredients-list">
      </ul>
      <button class = "coctail-modal__favorite-ingredient-btn" type="button">Add to favorite</button>
      <button class = "coctail-modal__close-modal-btn" type="button">X</button>
    </div>`;
            const closeCoctailModalBtn = document.querySelector(
              '.coctail-modal__close-modal-btn'
            );
            closeCoctailModalBtn.addEventListener('click', () => {
              coctailModal.classList.add(
                'coctails-section__coctail-modal--is-hidden'
              );
            });
            const ingredientsList = document.querySelector(
              '.coctail-modal__ingredients-list'
            );
            if (strIngredient1) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient1}</button></li>`;
            }
            if (strIngredient2) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient2}</button></li>`;
            }
            if (strIngredient3) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient3}</button></li>`;
            }
            if (strIngredient4) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient4}</button></li>`;
            }
            if (strIngredient5) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient5}</button></li>`;
            }
            if (strIngredient6) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient6}</button></li>`;
            }
            if (strIngredient7) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient7}</button></li>`;
            }
            if (strIngredient8) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient8}</button></li>`;
            }
            if (strIngredient9) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient9}</button></li>`;
            }
            if (strIngredient10) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient10}</button></li>`;
            }
            if (strIngredient11) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient11}</button></li>`;
            }
            if (strIngredient12) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient12}</button></li>`;
            }
            if (strIngredient13) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient13}</button></li>`;
            }
            if (strIngredient14) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient14}</button></li>`;
            }
            if (strIngredient15) {
              ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient15}</button></li>`;
            }
          }
        });
      });
    })
    .catch(alert.log);
}
// КОНЕЦ ЦИКЛА
