'use strict';

const coctailsList = document.querySelector('.coctails-section__coctails-list');
const coctailsSection = document.querySelector('.coctails-section');
const coctailModal = document.querySelector('.coctails-section__coctail-modal');
const coctailModalBackdrop = document.querySelector(
  '.coctails-section__coctail-modal-backdrop'
);

// проверяем есть ли в памяти коктейли
let favoriteCoctails = [];
try {
  if (JSON.parse(localStorage.getItem('favoriteCoctails')).length !== 0) {
    favoriteCoctails = JSON.parse(localStorage.getItem('favoriteCoctails'));
  }
} catch {
  localStorage.setItem('favoriteCoctails', JSON.stringify(favoriteCoctails));
}

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
  const fetchCoctailOrIngredient = async link => {
    const response = await fetch(link);
    const newResponse = await response.json();
    return newResponse;
  };
  // вызов функции фетча коктейлей с нужным нам поиском
  fetchCoctailOrIngredient(
    'https://www.thecocktaildb.com/api/json/v1/1/random.php'
  )
    .then(newResponse => {
      const { strDrinkThumb, strDrink } = newResponse.drinks[0];
      console.log(newResponse.drinks[0]);
      // проверяем есть ли коктейль текущей итерации в списке избранных коктейлей
      try {
        if (
          JSON.parse(localStorage.getItem('favoriteCoctails')).includes(
            strDrink
          )
        ) {
          // если коктейль текущей итерации есть в исписке избранных коктейлей
          // то добавляем разметку с коктейлем из текущей итерации цикла
          //с кнопкой "убрать из избранного"
          console.log('коктейль/ингредиент есть в избранном');
          coctailsList.innerHTML += `<li class='coctails-section__coctail'>
            <div class='coctails-section__coctail-container'>
                <img class='coctails-section__coctail-img' srcset="${strDrinkThumb}" alt="${strDrink}">
                <h3 class='coctails-section__coctail-name'>${strDrink}</h3>
                <div class="coctails-section__coctail-buttons-container">
                    <button class="coctails-section__button coctails-section__learn-button" type="button">Learn more</button>
                    <button class="coctails-section__button coctails-section__dislike-button" type="button">Remove</button>
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
      // создаём функцию, которая проверяет есть ли коктейль в избранных
      // меняет текст кнопки в зависимости от того есть или нет
      // и вешает слушателя события добавления/удаления в избранные
      const favoriteOrNot = (
        event,
        likeButton,
        dislikeButton,
        currentItemlName
      ) => {
        // если событие словилось на кнопке "добавить в избранное",
        // то добавляем в память массив с названиями избранных коктейлей
        // и меняем кнопку на "убрать из избранного"
        if (event.target.classList.contains(likeButton)) {
          event.target.textContent = 'Remove';
          favoriteCoctails.push(currentItemlName);
          localStorage.setItem(
            'favoriteCoctails',
            JSON.stringify(favoriteCoctails)
          );
          event.target.classList.toggle(dislikeButton);
          event.target.classList.toggle(likeButton);
          // если событие словилось на кнопке "убрать из избранного",
          // то добавляем в память массив с названиями избранных коктейлей,
          // из которых предварительно удаляем коктейль, на кнопке которого словилось событие
          // и меняем кнопку на "добавить в избранное"
        } else if (event.target.classList.contains(dislikeButton)) {
          event.target.textContent = 'Add to';
          favoriteCoctails.splice(
            favoriteCoctails.indexOf(currentItemlName),
            1
          );
          localStorage.setItem(
            'favoriteCoctails',
            JSON.stringify(favoriteCoctails)
          );
          event.target.classList.toggle(dislikeButton);
          event.target.classList.toggle(likeButton);
        }
      };
      //вешаем слушателя события на все КАРТОЧКИ(именно на карточки)
      coctailCards.forEach(elem => {
        elem.addEventListener('click', event => {
          const currentItemlName = event.currentTarget.querySelector(
            '.coctails-section__coctail-name'
          ).textContent;
          favoriteOrNot(
            event,
            'coctails-section__like-button',
            'coctails-section__dislike-button',
            currentItemlName
          );
          // при нажатии на кнопку "узнать больше" открываем модалку
          if (
            event.target.classList.contains('coctails-section__learn-button')
          ) {
            coctailModalBackdrop.classList.remove(
              'coctails-section__coctail-modal-backdrop--is-hidden'
            );
            coctailModal.classList.remove(
              'coctails-section__coctail-modal--is-hidden'
            );
            // получаем информацию о коктейле по имени карточки,
            // на которой словилось событие
            fetchCoctailOrIngredient(
              `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${currentItemlName}`
            ).then(newResponse => {
              const coctail = newResponse;
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
              } = coctail.drinks[0];
              // создаем изначальную разметку модалки
              coctailModal.innerHTML = `<h3 class = "coctail-modal__coctail-name" >${strDrink}</h3>
      <h4 class = "coctail-modal__coctail-description">Instractions:</h4>
      <p class = "coctail-modal__coctail-instruction">${strInstructions}</p>
      <img class='coctails-section__coctail-img' src="${strDrinkThumb}" alt="${strDrink}">
      <h4 class = "coctail-modal__coctail-description">Ingredients</h4>
      <p>Per cocktail</p>
      <ul class = "coctail-modal__ingredients-list">
      </ul>
      <button class = "coctail-modal__like-coctail-btn" type="button">Add to favorite</button>
      <button class = "coctail-modal__close-modal-btn" type="button"></button>
    </div>`;
              favoriteOrNot(
                event,
                'coctail-modal__like-coctail-btn',
                'coctail-modal__dislike-coctail-btn',
                currentItemlName
              );
              // вешаем на кнопку закрытия модалки функцию закрытия модалки
              const closeCoctailModalBtn = document.querySelector(
                '.coctail-modal__close-modal-btn'
              );
              closeCoctailModalBtn.addEventListener('click', () => {
                coctailModal.classList.add(
                  'coctails-section__coctail-modal--is-hidden'
                );
                coctailModalBackdrop.classList.add(
                  'coctails-section__coctail-modal-backdrop--is-hidden'
                );
              });
              // проверяем находится ли коктейль в списке избранных,
              // меняем текст кнопки в зависимости от того есть или нет
              // и вешаем слушателя события добавления/удаления в избранные
              const modalLikeBtn = document.querySelector(
                '.coctail-modal__like-coctail-btn'
              );
              modalLikeBtn.addEventListener('click', event => {
                favoriteOrNot(
                  event,
                  'coctail-modal__like-coctail-btn',
                  'coctail-modal__dislike-coctail-btn',
                  currentItemlName
                );
                if (
                  modalLikeBtn.classList.contains(
                    'coctail-modal__dislike-coctail-btn'
                  )
                ) {
                  modalLikeBtn.textContent = 'Remove from favorite';
                } else {
                  modalLikeBtn.textContent = 'Add to favorite';
                }
              });
              // функция создания списка ингредиентов
              const ingredientsList = document.querySelector(
                '.coctail-modal__ingredients-list'
              );
              const createIngredients = ingredientsList => {
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
              };
              createIngredients(ingredientsList);
              const modalIngredients = document.querySelectorAll(
                '.coctail-modal__ingredient'
              );
              modalIngredients.forEach(elem => {
                elem.addEventListener('click', event => {
                  const currentingredientName = event.target.innerText;
                  fetchCoctailOrIngredient(
                    `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${currentingredientName}`
                  )
                    .then(newResponse => {
                      console.log(newResponse.ingredients[0]);
                    })
                    .catch();
                });
              });
            });
          }
        });
      });
    })
    // КОНЕЦ ЦИКЛА
    .catch(alert.log);
}
