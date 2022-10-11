'use strict';
// РАБОЧАЯ ВЕРСИЯ
export const coctailsList = document.querySelector(
  '.coctails-section__coctails-list'
);
export const coctailsSection = document.querySelector('.coctails-section');
export const coctailModal = document.querySelector(
  '.coctails-section__coctail-modal'
);
export const coctailModalBackdrop = document.querySelector(
  '.coctails-section__coctail-modal-backdrop'
);
export const ingredientModal = document.querySelector(
  '.coctails-section__ingredient-modal'
);
export const ingredientModalBackdrop = document.querySelector(
  '.coctails-section__ingredient-modal-backdrop'
);

// переменная для подсчета к-ва коктейлей, которые нужно отрисовать
export let coctailsAmount = 0;
// переменная для идентификации кнопок коктейля
export let coctailNumber = 0;
// переменная для определения типа добавляемого в избранное(коктейль или ингредиент)
export let storageKey = 0;

////////////////////////////////////////////////////////////////////////////////////////////////
//                   НАЧАЛО ФУНКЦИЙ

// функция, которая считает количество коктейлей,
// которые нужно отрисовать в зависимости от разрешения экрана
export const getCocktailsAmount = section => {
  const coctailsSectionStyles = getComputedStyle(section);
  if (coctailsSectionStyles.width === '320px') {
    coctailsAmount = 3;
  } else if (coctailsSectionStyles.width === '768px') {
    coctailsAmount = 6;
  } else {
    coctailsAmount = 9;
  }
};

// функция, которая забирает у бекенда коктейли/ингредиенты по ссылке
export const fetchCoctailOrIngredient = async link => {
  const response = await fetch(link);
  const newResponse = await response.json();
  return newResponse;
};

// функция, которая проверяет
// находится ли коктейль или ингредиент в избранном
// и меняет кнопку коктейля на "добавить в избранное" или "убрать из избранного"
export const checkFavoriteOrNot = (
  coctailName,
  typeOfFavorites,
  likeBtn,
  dislikeBtn,
  text,
  coctailNumber
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
    JSON.parse(localStorage.getItem(localStorage.key(storageKey))).includes(
      coctailName
    )
  ) {
    // проверяем есть ли коктейль/ингредиент текущей итерации цикла
    // в списке избранных
    if (document.querySelector(`#ModalLikeIngredientBtn`)) {
      currentFuncLikeBtn = document.querySelector(`#ModalLikeIngredientBtn`);
    } else if (document.querySelector(`#ModalLikeCoctailBtn`)) {
      currentFuncLikeBtn = document.querySelector(`#ModalLikeCoctailBtn`);
    } else {
      currentFuncLikeBtn = document.querySelector(`#likeBtn${coctailNumber}`);
    }
    // если есть - то меняем в разметке
    // коктейля/ингредиента кнопку "добавить в избранное"
    //на кнопку "убрать из избранного"
    currentFuncLikeBtn.classList.remove(likeBtn);
    currentFuncLikeBtn.classList.add(dislikeBtn);
    currentFuncLikeBtn.textContent = text;
  }
};

// функция, которая добавляет/удаляет коктейль/игредиент в избранное
// и меняет кнопку "добавить в избранное" на "удалить из избранного" и наоборот
export const makeFavoriteOrNot = (
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

// функция открытия/закрытия модалки
export const modalToggleHidden = (
  backdropName,
  backdropClass,
  modalName,
  modalClass
) => {
  backdropName.classList.toggle(backdropClass);
  modalName.classList.toggle(modalClass);
};

// функция создания списка ингредиентов
export const createIngredients = coctail => {
  const ingredientsList = document.querySelector('.coctail-modal__list');
  for (const key in coctail) {
    if (key.includes('strIngredient') && coctail[key] !== null) {
      ingredientsList.innerHTML += `<li><button class="coctail-modal__ingredient" type="button">${coctail[key]}</button></li>`;
    }
  }
};

// функция изменения текста кнопок модалки(он отличается от того, что на главной странице)
export const modalButtonTextChange = (button, buttonClass) => {
  if (button.classList.contains(buttonClass)) {
    button.textContent = 'Add to favorite';
  } else {
    button.textContent = 'Remove from favorite';
  }
};
//                   КОНЕЦ ФУНКЦИЙ
////////////////////////////////////////////////////////////////////////////////////////////////
//                   НАЧАЛО ДВИЖУХИ

// проверяем есть ли в памяти коктейли и ингредиенты
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

// определяем сколько карточек нужно отрисовать
getCocktailsAmount(coctailsSection);

// дальше черная магия.
// цикл делает столько итераций, сколько нужно отрисовать коктейлей
// НАЧАЛО ЦИКЛА
for (let iteration = 0; iteration < coctailsAmount; iteration += 1) {
  // забираем у бекенда рандомный коктейль
  fetchCoctailOrIngredient(
    'https://www.thecocktaildb.com/api/json/v1/1/random.php'
  )
    .then(newResponse => {
      const { strDrinkThumb, strDrink } = newResponse.drinks[0];

      // добавляем разметку с коктейлем из текущей итерации цикла
      //с кнопкой "добавить в избранное"
      coctailsList.innerHTML += `<li class='coctails-section__coctail'>
            <div class='coctails-section__coctail-container'>
                <img class='coctails-section__coctail-img' srcset="${strDrinkThumb}" alt="${strDrink}">
                <h3 class='coctails-section__coctail-name'>${strDrink}</h3>
                <div class="coctails-section__coctail-buttons-container">
                    <button class="coctails-section__button coctails-section__learn-button" type="button">Learn more</button>
                    <button class="coctails-section__button coctails-section__favorite-button coctails-section__like-button" type="button" id="likeBtn${coctailNumber}">Add to</button>
                </div>
            </div>
        </li>`;

      // увеличиваем счетчик коклейлей на 1
      coctailNumber += 1;

      // проверяем находится ли коктейль или ингредиент в избранном
      checkFavoriteOrNot(
        strDrink,
        favoriteCoctails,
        'coctails-section__like-button',
        'coctails-section__dislike-button',
        'Remove',
        coctailNumber
      );

      // выбираем все созданные карточки коктейлей(вне зависимости от итерации)
      const coctailCards = document.querySelectorAll(
        '.coctails-section__coctail-container'
      );

      //вешаем слушателя события на все КАРТОЧКИ коктейлей(именно на карточки)
      coctailCards.forEach(elem => {
        elem.addEventListener('click', event => {
          //создаём переменную, которая будет содержать имя коктейля текущей итерации цикла
          const currentItemlName = event.currentTarget.querySelector(
            '.coctails-section__coctail-name'
          ).textContent;
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
            // запоминаем айди текущей кнопки лайка, чтоб если лайк ставился на модалке - менялась кнопка на главной
            const currentCoctailNumber = event.currentTarget
              .querySelector('.coctails-section__favorite-button')
              .getAttribute('id');

            // забираем у бекенда коктейль, на карточке которого открывается модалка
            // и получаем всю нужную инфу для модалки
            fetchCoctailOrIngredient(
              `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${currentItemlName}`
            ).then(newResponse => {
              const coctail = newResponse;
              const { strDrinkThumb, strDrink, strInstructions } =
                coctail.drinks[0];

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
                coctailNumber
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
                modalButtonTextChange(
                  modalLikeBtn,
                  'coctail-modal__like-coctail-btn'
                );
                // меняем так же копку добавления/удаления в избранное на главной странице
                const currentLikeButton = document.querySelector(
                  `#${currentCoctailNumber}`
                );
                currentLikeButton.classList.toggle(
                  'coctails-section__like-button'
                );
                currentLikeButton.classList.toggle(
                  'coctails-section__dislike-button'
                );
                if (
                  currentLikeButton.classList.contains(
                    'coctails-section__like-button'
                  )
                ) {
                  currentLikeButton.textContent = 'Add to';
                } else {
                  currentLikeButton.textContent = 'Remove';
                }
              });

              // открываем модалку
              modalToggleHidden(
                coctailModalBackdrop,
                'coctails-section__coctail-modal-backdrop--is-hidden',
                coctailModal,
                'coctails-section__coctail-modal--is-hidden'
              );

              // вешаем на кнопку закрытия модалки функцию, которая закроет модалку
              const closeCoctailModalBtn = document.querySelector(
                '.coctail-modal__close-modal-btn'
              );
              closeCoctailModalBtn.addEventListener('click', () => {
                modalToggleHidden(
                  coctailModalBackdrop,
                  'coctails-section__coctail-modal-backdrop--is-hidden',
                  coctailModal,
                  'coctails-section__coctail-modal--is-hidden'
                );
              });

              // создаем список ингредиентов
              createIngredients(coctail.drinks[0]);
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
                        coctailNumber
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

                          modalButtonTextChange(
                            ingredientModalLikeBtn,
                            'ingredient-modal__like-ingredient-btn'
                          );
                        }
                      );
                      // делаем переменную кнопки закрытия модалки ингредиента
                      const closeIngredientlModalBtn = document.querySelector(
                        '.ingredient-modal__close-ingredient-btn'
                      );

                      // открываем модалку
                      modalToggleHidden(
                        ingredientModalBackdrop,
                        'coctails-section__ingredient-modal-backdrop--is-hidden',
                        ingredientModal,
                        'coctails-section__ingredient-modal--is-hidden'
                      );

                      // вешаем на кнопку закрытия модалки функцию, которая закроет модалку
                      closeIngredientlModalBtn.addEventListener('click', () => {
                        modalToggleHidden(
                          ingredientModalBackdrop,
                          'coctails-section__ingredient-modal-backdrop--is-hidden',
                          ingredientModal,
                          'coctails-section__ingredient-modal--is-hidden'
                        );
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
