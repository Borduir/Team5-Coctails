'use strict';
// РАБОЧАЯ ВЕРСИЯ
const coctailsList = document.querySelector('.coctails-section__coctails-list');
const coctailsSection = document.querySelector('.coctails-section');
const coctailModal = document.querySelector('.coctails-section__coctail-modal');
const coctailModalBackdrop = document.querySelector(
  '.coctails-section__coctail-modal-backdrop'
);
const ingredientModal = document.querySelector(
  '.coctails-section__ingredient-modal'
);
const ingredientModalBackdrop = document.querySelector(
  '.coctails-section__ingredient-modal-backdrop'
);

let randomCoctails = [];

// создаём глобальную переменную, с помощью которой
// будем в функции проверять добавляем в избранное коктейль или ингредиент
let storageKey;

// проверяем есть ли в памяти коктейли
let favoriteCoctails = [];
try {
  if (JSON.parse(localStorage.getItem('favoriteCoctails')).length !== 0) {
    favoriteCoctails = JSON.parse(localStorage.getItem('favoriteCoctails'));
  }
} catch {
  localStorage.setItem('favoriteCoctails', JSON.stringify(favoriteCoctails));
}

// проверяем есть ли в памяти ингредиенты
let favoriteIngredients = [];
try {
  if (JSON.parse(localStorage.getItem('favoriteIngredients')).length !== 0) {
    favoriteIngredients = JSON.parse(
      localStorage.getItem('favoriteIngredients')
    );
  }
} catch {
  localStorage.setItem(
    'favoriteIngredients',
    JSON.stringify(favoriteIngredients)
  );
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
for (let iteration = 0; iteration < coctailsAmount; iteration += 1) {
  // создаём функцию, которая забирает у бекенда коктейль/ингредиент по ссылке
  const fetchCoctailOrIngredient = async link => {
    const response = await fetch(link);
    const newResponse = await response.json();
    return newResponse;
  };
  // забираем у бекенда рандомный коктейль
  fetchCoctailOrIngredient(
    'https://www.thecocktaildb.com/api/json/v1/1/random.php'
  )
    .then(newResponse => {
      const { strDrinkThumb, strDrink } = newResponse.drinks[0];

      // добавляем разметку с коктейлем из текущей итерации цикла
      //с кнопкой "убрать из избранного"
      coctailsList.innerHTML += `<li class='coctails-section__coctail'>
            <div class='coctails-section__coctail-container'>
                <img class='coctails-section__coctail-img' srcset="${strDrinkThumb}" alt="${strDrink}">
                <h3 class='coctails-section__coctail-name'>${strDrink}</h3>
                <div class="coctails-section__coctail-buttons-container">
                    <button class="coctails-section__button coctails-section__learn-button" type="button">Learn more</button>
                    <button class="coctails-section__button coctails-section__like-button" type="button" id="likeBtn${iteration}">Add to</button>
                </div>
            </div>
        </li>`;

      //создаём функцию, которая проверяет
      // находится ли коктейль или ингредиент в избранном
      const checkFavoriteOrNot = (
        coctailName,
        typeOfFavorites,
        likeBtn,
        dislikeBtn,
        text,
        iteration
      ) => {
        //узнаём какой тип избранного проверяем - коктейль или ингредиент
        let currentFuncLikeBtn = '';
        if (typeOfFavorites === favoriteCoctails) {
          storageKey = 0;
        } else if (typeOfFavorites === favoriteIngredients) {
          storageKey = 1;
        }
        // если коктейль или игредиент находится в избранном
        if (
          JSON.parse(
            localStorage.getItem(localStorage.key(storageKey))
          ).includes(coctailName)
        ) {
          // проверяем есть ли коктейль/ингредиент текущей итерации цикла
          //  в списке избранных
          if (document.querySelector(`#ModalLikeIngredientBtn`)) {
            currentFuncLikeBtn = document.querySelector(
              `#ModalLikeIngredientBtn`
            );
          } else if (document.querySelector(`#ModalLikeCoctailBtn`)) {
            currentFuncLikeBtn = document.querySelector(`#ModalLikeCoctailBtn`);
          } else {
            currentFuncLikeBtn = document.querySelector(`#likeBtn${iteration}`);
          }
          // если есть - то меняем в разметке
          // коктейля/ингредиента кнопку "добавить в избранное"
          //на кнопку "убрать из избранного"
          currentFuncLikeBtn.classList.remove(likeBtn);
          currentFuncLikeBtn.classList.add(dislikeBtn);
          currentFuncLikeBtn.textContent = text;
        }
      };
      // проверяем находится ли коктейль или ингредиент в избранном
      checkFavoriteOrNot(
        strDrink,
        favoriteCoctails,
        'coctails-section__like-button',
        'coctails-section__dislike-button',
        'Remove',
        iteration
      );

      // выбираем все созданные карточки коктейлей(вне зависимости от итерации)
      const coctailCards = document.querySelectorAll(
        '.coctails-section__coctail-container'
      );

      // создаём функцию, которая добавляет/удаляет коктейль/игредиент в избранное
      // и меняет кнопку "добавить в избранное" на "удалить из избранного" и наоборот
      const makeFavoriteOrNot = (
        event,
        likeButton,
        dislikeButton,
        currentItemlName,
        typeOfFavorites
      ) => {
        //проверяем обрабатывается коктейль или ингредиент
        if (typeOfFavorites === favoriteCoctails) {
          storageKey = 0;
        } else if (typeOfFavorites === favoriteIngredients) {
          storageKey = 1;
        }
        // если событие словилось на кнопке "добавить в избранное",
        // то добавляем в память массив с названиями избранных коктейлей/ингредиентов
        // и меняем кнопку на "убрать из избранного"
        if (event.target.classList.contains(likeButton)) {
          event.target.textContent = 'Remove';
          typeOfFavorites.push(currentItemlName);
          localStorage.setItem(
            localStorage.key(storageKey),
            JSON.stringify(typeOfFavorites)
          );
          event.target.classList.toggle(dislikeButton);
          event.target.classList.toggle(likeButton);
          // если событие словилось на кнопке "убрать из избранного",
          // то добавляем в память массив с названиями избранных коктейлей/ингредиентов,
          // из которых предварительно удаляем текущий коктейль/ингредиент
          // и меняем кнопку на "добавить в избранное"
        } else if (event.target.classList.contains(dislikeButton)) {
          event.target.textContent = 'Add to';
          typeOfFavorites.splice(typeOfFavorites.indexOf(currentItemlName), 1);
          localStorage.setItem(
            localStorage.key(storageKey),
            JSON.stringify(typeOfFavorites)
          );
          // переключаем кнопки "добавить в избранное" и "удалить из избранного"
          event.target.classList.toggle(dislikeButton);
          event.target.classList.toggle(likeButton);
        }
      };

      //вешаем слушателя события на все КАРТОЧКИ коктейлей(именно на карточки)
      coctailCards.forEach(elem => {
        elem.addEventListener('click', event => {
          //создаём переменную, которая будет содержать имя коктейля текущей итерации цикла
          const currentItemlName = event.currentTarget.querySelector(
            '.coctails-section__coctail-name'
          ).textContent;

          // создаем переменную, которая запоминает название коктейля текущей итерации
          const currentCoctailCardName = currentItemlName;

          //добавляем/удаляем коктейль/игредиент в избранное
          makeFavoriteOrNot(
            event,
            'coctails-section__like-button',
            'coctails-section__dislike-button',
            currentItemlName,
            favoriteCoctails
          );

          // при нажатии на кнопку "узнать больше" на коктейле
          if (
            event.target.classList.contains('coctails-section__learn-button')
          ) {
            // забираем у бекенда коктейль, на карточке которого открывается модалка
            // и получаем всю нужную инфу для модалки
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
                  <ul class = "coctail-modal__list">
                  </ul>
                  <button class = "coctail-modal__like-coctail-btn" type="button" id="ModalLikeCoctailBtn">Add to favorite</button>
                  <button class = "coctail-modal__close-modal-btn" type="button"></button>
                </div>`;

              // создаём переменную текущей кнопки "добавить в избранное"
              const modalLikeBtn = document.querySelector(
                '.coctail-modal__like-coctail-btn'
              );

              // проверяем находится ли коктейль в списке избранных,
              // меняем текст кнопки в зависимости от того есть или нет
              checkFavoriteOrNot(
                strDrink,
                favoriteCoctails,
                'coctail-modal__like-coctail-btn',
                'coctail-modal__dislike-coctail-btn',
                'Remove from favorites',
                iteration
              );

              // вешаем слушателя события добавления/удаления в избранные
              modalLikeBtn.addEventListener('click', event => {
                makeFavoriteOrNot(
                  event,
                  'coctail-modal__like-coctail-btn',
                  'coctail-modal__dislike-coctail-btn',
                  currentItemlName,
                  favoriteCoctails
                );

                //меняем текст кнопки на длинный(на модалках он отличается)
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

              // создаём функцию открытия/закрытия модалки
              const modalCocktailToggleHidden = () => {
                coctailModalBackdrop.classList.toggle(
                  'coctails-section__coctail-modal-backdrop--is-hidden'
                );
                coctailModal.classList.toggle(
                  'coctails-section__coctail-modal--is-hidden'
                );
              };

              // открываем модалку
              modalCocktailToggleHidden();

              // вешаем на кнопку закрытия модалки функцию, которая закроет модалку
              const closeCoctailModalBtn = document.querySelector(
                '.coctail-modal__close-modal-btn'
              );
              closeCoctailModalBtn.addEventListener('click', () => {
                modalCocktailToggleHidden();
                ////////////////////////////////////////////////////////////////////////////////
                // НЕРАБОЧИЙ КУСОК, ДОЛЖЕН МЕНЯТЬ КНОПКУ ДОБАВИТЬ/УДАЛИТЬ В КАРТОЧКЕ КОКТЕЙЛЯ
                const changeCarFavoriteButton = async () => {
                  for (let i = 0; i < coctailsAmount; i += 1) {
                    await checkFavoriteOrNot(
                      currentCoctailCardName,
                      favoriteCoctails,
                      'coctails-section__like-button',
                      'coctails-section__dislike-button',
                      'Remove',
                      i
                    );
                    console.log(
                      'currentCoctailCardName:' + currentCoctailCardName
                    );
                    console.log('i:' + i);
                  }
                };
                changeCarFavoriteButton();
              });
              ////////////////////////////////////////////////////////////////////////////////////

              // функция создания списка ингредиентов
              const ingredientsList = document.querySelector(
                '.coctail-modal__list'
              );
              // проходим по каждому номеру ингредиента и возвращаемся при первом "null"
              const createIngredients = ingredientsList => {
                if (strIngredient1) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient1}</button></li>`;
                } else return;
                if (strIngredient2) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient2}</button></li>`;
                } else return;
                if (strIngredient3) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient3}</button></li>`;
                } else return;
                if (strIngredient4) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient4}</button></li>`;
                } else return;
                if (strIngredient5) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient5}</button></li>`;
                } else return;
                if (strIngredient6) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient6}</button></li>`;
                } else return;
                if (strIngredient7) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient7}</button></li>`;
                } else return;
                if (strIngredient8) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient8}</button></li>`;
                } else return;
                if (strIngredient9) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient9}</button></li>`;
                } else return;
                if (strIngredient10) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient10}</button></li>`;
                } else return;
                if (strIngredient11) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient11}</button></li>`;
                } else return;
                if (strIngredient12) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient12}</button></li>`;
                } else return;
                if (strIngredient13) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient13}</button></li>`;
                } else return;
                if (strIngredient14) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient14}</button></li>`;
                } else return;
                if (strIngredient15) {
                  ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${strIngredient15}</button></li>`;
                } else return;
              };

              // создаем список ингредиентов
              createIngredients(ingredientsList);
              const modalIngredients = document.querySelectorAll(
                '.coctail-modal__ingredient'
              );

              // при клике на ингредиент
              // забираем у бекенда его данные по его имени и создаем модалку
              modalIngredients.forEach(elem => {
                elem.addEventListener('click', event => {
                  const currentingredientName = event.target.innerText;
                  fetchCoctailOrIngredient(
                    `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${currentingredientName}`
                  )
                    .then(newResponse => {
                      const {
                        strAlcohol,
                        strDescription,
                        strIngredient,
                        strType,
                      } = newResponse.ingredients[0];

                      //создаем изначальную разметку модалки ингредиента
                      ingredientModal.innerHTML = `<h3 class = "coctail-modal__coctail-name">${strIngredient}</h3>
                        <p class = "coctail-modal__coctail-instruction">${strDescription}</p>
                        <ul class = "coctail-modal__list">
                          <li><p class = "coctail-modal__list-item-data">Type: ${strType}</p></li>
                          <li><p  class = "coctail-modal__list-item-data">Alkoholic? - ${strAlcohol}</p></li>
                        </ul>
                        <button class = "ingredient-modal__like-ingredient-btn" type="button" id="ModalLikeIngredientBtn">Add to favorite</button>
                        <button class = "ingredient-modal__close-ingredient-btn" type="button"></button>
                        `;

                      // создаём переменную кнопки "добавить в избранное" модалки ингредиента
                      const ingredientModalLikeBtn = document.querySelector(
                        '.ingredient-modal__like-ingredient-btn'
                      );

                      // проверяем есть ли ингредиент в избранном
                      checkFavoriteOrNot(
                        strIngredient,
                        favoriteIngredients,
                        'ingredient-modal__like-ingredient-btn',
                        'ingredient-modal__dislike-ingredient-btn',
                        'Remove from favorites',
                        iteration
                      );

                      // вешаем на кнопку "добавить в избранное" модалки ингредиента
                      // функцию добавления/удаления в избранное
                      ingredientModalLikeBtn.addEventListener(
                        'click',
                        event => {
                          const currentItemlName = strIngredient;
                          makeFavoriteOrNot(
                            event,
                            'ingredient-modal__like-ingredient-btn',
                            'ingredient-modal__dislike-ingredient-btn',
                            currentItemlName,
                            favoriteIngredients
                          );
                          //меняем текст кнопки на длинный(на модалках он отличается)
                          if (
                            ingredientModalLikeBtn.classList.contains(
                              'ingredient-modal__like-ingredient-btn'
                            )
                          ) {
                            ingredientModalLikeBtn.textContent =
                              'Add to favorite';
                          } else {
                            ingredientModalLikeBtn.textContent =
                              'Remove from favorite';
                          }
                        }
                      );
                      // делаем переменную кнопки закрытия модалки ингредиента
                      const closeIngredientlModalBtn = document.querySelector(
                        '.ingredient-modal__close-ingredient-btn'
                      );

                      // создаём функцию открытия/закрытия модалки
                      const modalIngregientToggleHidden = () => {
                        ingredientModal.classList.toggle(
                          'coctails-section__ingredient-modal--is-hidden'
                        );
                        ingredientModalBackdrop.classList.toggle(
                          'coctails-section__ingredient-modal-backdrop--is-hidden'
                        );
                      };

                      // открываем модалку
                      modalIngregientToggleHidden();
                      // вешаем на кнопку закрытия модалки функцию, которая закроет модалку
                      closeIngredientlModalBtn.addEventListener('click', () => {
                        modalIngregientToggleHidden();
                      });
                    })
                    .catch(alert.log);
                });
              });
            });
          }
        });
      });
    })
    .catch(alert.log);
}
// КОНЕЦ ЦИКЛА
// СПАСИБО ЗА ВНИМАНИЕ :)
