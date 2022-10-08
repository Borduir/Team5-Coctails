'use strict';

const coctailsList = document.querySelector('.coctails-section__coctails-list');
const coctailsSection = document.querySelector('.coctails-section');

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
      const { strDrinkThumb, strDrink } = coctails.drinks[0];
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
                    <button class="coctails-section__button coctails-section__learn-button">Learn more</button>
                    <button class="coctails-section__button coctails-section__like-button">Add to</button>
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
          }
        });
      });
    })
    .catch(alert.log);
}
// КОНЕЦ ЦИКЛА
