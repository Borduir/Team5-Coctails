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

// переменная для подсчета к-ва коктейлей, которые нужно отрисовать
let coctailsAmount = 0;
// переменная для идентификации кнопок коктейля
let coctailNumber = 0;
// переменная для определения типа добавляемого в избранное(коктейль или ингредиент)
let storageKey = 0;

let searchIn = 0;

////////////////////////////////////////////////////////////////////////////////////////////////
//                   НАЧАЛО ФУНКЦИЙ

// функция, которая считает количество коктейлей,
// которые нужно отрисовать в зависимости от разрешения экрана
const getCocktailsAmount = section => {
  if (!section) return;
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
  likeBtn,
  dislikeBtn,
  text,
  coctailNumber,
  type
) => {
  //узнаём какой тип избранного проверяем - коктейль или ингредиент
  let currentFuncLikeBtn = '';
  if (type === 'Ingredients') {
    storageKey = 1;
  } else if (type === 'Coctails') {
    storageKey = 0;
  }
  // если коктейль или игредиент находится в избранном

  const storageKeys = JSON.parse(
    localStorage.getItem(localStorage.key(storageKey))
  );
  if (storageKeys.includes(coctailName)) {
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
  typeOfFavorites,
  type
) => {
  //проверяем обрабатывается коктейль или ингредиент
  if (type === 'Ingredients') {
    storageKey = 1;
  } else if (type === 'Coctails') {
    storageKey = 0;
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
const createIngredients = coctail => {
  const ingredientsList = document.querySelector('.coctail-modal__list');
  for (const key in coctail) {
    if (key.includes('strIngredient') && coctail[key] !== null) {
      ingredientsList.innerHTML += `<li class ="coctail-modal__list-item"><button class="coctail-modal__ingredient" type="button">✶ ${coctail[key]}</button></li>`;
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

// функция добавляет разметку карточки коктейля из текущей итерации цикла
//с кнопкой "добавить в избранное"
const coctailCardMarkup = (
  markupPlace = '',
  cocktailName = '',
  cocktailImgLink = ''
) => {
  markupPlace.innerHTML += `<li class='coctails-section__coctail'>
            <div class='coctails-section__coctail-container'>
                <img class='coctails-section__coctail-img' srcset="${cocktailImgLink}" alt="${cocktailName}">
                <h3 class='coctails-section__coctail-name'>${cocktailName}</h3>
                <div class="coctails-section__coctail-buttons-container">
                    <button class="coctails-section__button coctails-section__learn-button" type="button">Learn more</button>
                    <button class="coctails-section__button coctails-section__favorite-button coctails-section__like-button" type="button" id="likeBtn${coctailNumber}">Add to</button>
                </div>
            </div>
        </li>`;
};

// функция разметки модалки коктейля
const coctailModalMarckup = (
  marckupPlace,
  coctailName,
  coctailImgLink,
  coctailInstructions
) => {
  if (getComputedStyle(coctailsSection).width === '320px') {
    marckupPlace.innerHTML = `<h3 class = "coctail-modal__coctail-name" >${coctailName}</h3>
                  <h4 class = "coctail-modal__coctail-description">Instructions:</h4>
                  <p class = "coctail-modal__coctail-instruction">${coctailInstructions}</p>
                  <img class='coctails-section__coctail-img' src="${coctailImgLink}" alt="${coctailName}">
                  <h4 class = "coctail-modal__coctail-bottom-description">Ingredients</h4>
                  <p class = "coctail-modal__per-class-text">Per cocktail</p>
                  <ul class = "coctail-modal__list">
                  </ul>
                  <button class = "coctail-modal__like-coctail-btn" type="button" id="ModalLikeCoctailBtn">Add to favorite</button>
                  <button class = "coctail-modal__close-modal-btn" type="button"></button>`;
  } else {
    marckupPlace.innerHTML = `
                  <div  class = "coctail-modal__flex-container">
                  <img class='coctails-section__coctail-img coctail-modal__img' src="${coctailImgLink}" alt="${coctailName}">
                  <div class = "coctail-modal__top-container">
                    <h3 class = "coctail-modal__coctail-name" >${coctailName}</h3>
                    <h4 class = "coctail-modal__coctail-bottom-description">Ingredients</h4>
                    <p class = "coctail-modal__per-class-text">Per cocktail</p>
                    <ul class = "coctail-modal__list"></ul>
                  </div>
                  </div>
                  <h4 class = "coctail-modal__coctail-description">Instructions:</h4>
                  <p class = "coctail-modal__coctail-instruction">${coctailInstructions}</p>
                  <button class = "coctail-modal__like-coctail-btn" type="button" id="ModalLikeCoctailBtn">Add to favorite</button>
                  <button class = "coctail-modal__close-modal-btn" type="button"></button>`;
  }
};

// функция разметки модалки ингредиента
export const ingredientModalMarckup = (
  marckupPlace,
  ingName,
  ingDescription,
  ingType,
  ingAlcohol
) => {
  if (!ingDescription) ingDescription = 'sorry, we have no data :(';
  if (!ingType) ingType = 'sorry, we have no data :(';
  if (!ingAlcohol) ingAlcohol = 'sorry, we have no data :(';
  marckupPlace.innerHTML = `<h3 class = "coctail-modal__coctail-name">${ingName}</h3>
                        <div class= "ingredient-modal__border-box"><p class = "coctail-modal__coctail-instruction">${ingDescription}</p></div>
                        <ul class = "coctail-modal__list">
                          <li class = "coctail-modal__list-item"><p class = "coctail-modal__ingredient">Type: ${ingType}</p></li>
                          <li class = "coctail-modal__list-item"><p  class = "coctail-modal__ingredient">Alkoholic? - ${ingAlcohol}</p></li>
                        </ul>
                        <button class = "ingredient-modal__like-ingredient-btn" type="button" id="ModalLikeIngredientBtn">Add to favorite</button>
                        <button class = "ingredient-modal__close-ingredient-btn" type="button"></button>
                        `;
};
//                   КОНЕЦ ФУНКЦИЙ
////////////////////////////////////////////////////////////////////////////////////////////////
//                   НАЧАЛО ДВИЖУХИ

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

// определяем сколько карточек нужно отрисовать
getCocktailsAmount(coctailsSection);

// дальше черная магия.
// цикл делает столько итераций, сколько нужно отрисовать коктейлей
//////////////////////////////////////////////////////////////////////////////////
// НАЧАЛО ЦИКЛА
export default function mainFunction(
  searchIn,
  searchLink,
  amount,
  mainMarkupPlace
) {
  if (!mainMarkupPlace) return;
  if (searchIn < 2 && mainMarkupPlace) {
    mainMarkupPlace.innerHTML = '';
  }

  for (let iteration = 0; iteration < amount; iteration += 1) {
    // забираем у бекенда рандомный коктейль
    fetchCoctailOrIngredient(searchLink)
      .then(newResponse => {
        if (searchIn === 1) {
          fetchCoctailOrIngredient(searchLink).then(newResponse => {
            coctailsAmount = newResponse.drinks.length;
          });
        }

        // увеличиваем счетчик коклейлей на 1
        coctailNumber += 1;
        let coctailIterationNumber = 0;

        if (searchIn) {
          coctailIterationNumber = iteration;
        }
        const { strDrinkThumb = '', strDrink = '' } =
          newResponse.drinks[coctailIterationNumber];

        // создаем разметку карточки
        coctailCardMarkup(mainMarkupPlace, strDrink, strDrinkThumb);

        // проверяем находится ли коктейль или ингредиент в избранном
        checkFavoriteOrNot(
          strDrink,
          'coctails-section__like-button',
          'coctails-section__dislike-button',
          'Remove',
          coctailNumber,
          'Coctails'
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
              favoriteCoctails,
              'Coctails'
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

                const {
                  strDrinkThumb = '',
                  strDrink = '',
                  strInstructions = '',
                } = coctail.drinks[0];

                // создаем изначальную разметку модалки
                if (coctailModal) {
                  coctailModalMarckup(
                    coctailModal,
                    strDrink,
                    strDrinkThumb,
                    strInstructions
                  );
                }

                // создаём переменную текущей кнопки "добавить в избранное"
                const modalLikeBtn = document.querySelector(
                  '.coctail-modal__like-coctail-btn'
                );

                // проверяем находится ли коктейль в списке избранных,
                // меняем текст кнопки в зависимости от того есть или нет
                checkFavoriteOrNot(
                  strDrink,
                  'coctail-modal__like-coctail-btn',
                  'coctail-modal__dislike-coctail-btn',
                  'Remove from favorites',
                  coctailNumber,
                  'Coctails'
                );

                // вешаем слушателя события добавления/удаления в избранные
                modalLikeBtn.addEventListener('click', event => {
                  makeFavoriteOrNot(
                    event,
                    'coctail-modal__like-coctail-btn',
                    'coctail-modal__dislike-coctail-btn',
                    currentItemlName,
                    favoriteCoctails,
                    'Coctails'
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

                // делаем переменную кнопки закрытия модалки
                const closeCoctailModalBtn = document.querySelector(
                  '.coctail-modal__close-modal-btn'
                );

                // вешаем на бекдроп и кнопку закрытия модалки слушателя, который закроет модалку
                window.addEventListener('click', event => {
                  if (
                    event.target === coctailModalBackdrop ||
                    event.target === closeCoctailModalBtn
                  ) {
                    coctailModal.classList.add(
                      'coctails-section__coctail-modal--is-hidden'
                    );
                    coctailModalBackdrop.classList.add(
                      'coctails-section__coctail-modal-backdrop--is-hidden'
                    );
                  }
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
                    const currentingredientName =
                      event.target.innerText.slice(2);
                    currentingredientName;
                    fetchCoctailOrIngredient(
                      `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${currentingredientName}`
                    )
                      .then(newResponse => {
                        const {
                          strAlcohol = '',
                          strDescription = '',
                          strIngredient = '',
                          strType = '',
                        } = newResponse.ingredients[0];

                        // создаем изначальную разметку модалки ингредиента
                        ingredientModalMarckup(
                          ingredientModal,
                          strIngredient,
                          strDescription,
                          strType,
                          strAlcohol
                        );

                        // создаём переменную кнопки "добавить в избранное" модалки ингредиента
                        const ingredientModalLikeBtn = document.querySelector(
                          '.ingredient-modal__like-ingredient-btn'
                        );

                        // проверяем есть ли ингредиент в избранном
                        checkFavoriteOrNot(
                          strIngredient,
                          'ingredient-modal__like-ingredient-btn',
                          'ingredient-modal__dislike-ingredient-btn',
                          'Remove from favorites',
                          coctailNumber,
                          'Ingredients'
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
                              favoriteIngredients,
                              'Ingredients'
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

                        // вешаем на бекдроп и кнопку закрытия модалки слушателя, который закроет модалку
                        window.addEventListener('click', event => {
                          if (
                            event.target === ingredientModalBackdrop ||
                            event.target === closeIngredientlModalBtn
                          ) {
                            ingredientModal.classList.add(
                              'coctails-section__ingredient-modal--is-hidden'
                            );
                            ingredientModalBackdrop.classList.add(
                              'coctails-section__ingredient-modal-backdrop--is-hidden'
                            );
                          }
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
      .catch(console.log);
  }
}
mainFunction(
  0,
  'https://www.thecocktaildb.com/api/json/v1/1/random.php',
  coctailsAmount,
  coctailsList
);

// КОНЕЦ ЦИКЛА
// СПАСИБО ЗА ВНИМАНИЕ :)
