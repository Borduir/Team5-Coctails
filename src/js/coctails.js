'use strict';

const coctailsList = document.querySelector('.coctails-section__coctails-list');

let coctailsAmount = 3;

for (let i = 0; i < coctailsAmount; i += 1) {
  const fetchCoctail = async () => {
    const response = await fetch(
      'https://www.thecocktaildb.com/api/json/v1/1/random.php'
    );
    const coctails = await response.json();
    return coctails;
  };
  fetchCoctail()
    .then(coctails => {
      const { strDrinkThumb, strDrink } = coctails.drinks[0];
      coctailsList.innerHTML += `<li class='coctails-section__coctail'>
            <div class='coctails-section__coctail-container'>
                <img class='coctails-section__coctail-img' src="${strDrinkThumb}" alt="${strDrink}">
                <h3 class='coctails-section__coctail-name'>${strDrink}</h3>
                <div class="coctails-section__coctail-buttons-container">
                    <button class="coctails-section__button coctails-section__learn-button">Learn more</button>
                    <button class="coctails-section__button coctails-section__like-button"><span class="coctails-section__like-text">Add to  </span></button>
                </div>
            </div>
        </li>`;
    })
    .catch(alert.log);
}
