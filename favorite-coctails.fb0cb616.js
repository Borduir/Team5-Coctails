const t=document.querySelector(".coctails-section__coctails-list"),e=document.querySelector(".coctails-section"),o=document.querySelector(".coctails-section__coctail-modal"),c=document.querySelector(".coctails-section__coctail-modal-backdrop"),i=document.querySelector(".coctails-section__ingredient-modal"),n=document.querySelector(".coctails-section__ingredient-modal-backdrop");let l=0,a=0,s=0;const r=async t=>{const e=await fetch(t);return await e.json()},d=(t,e,o,c,i,n)=>{let l="";e===k?s=0:e===h&&(s=1),JSON.parse(localStorage.getItem(localStorage.key(s))).includes(t)&&(l=document.querySelector("#ModalLikeIngredientBtn")?document.querySelector("#ModalLikeIngredientBtn"):document.querySelector("#ModalLikeCoctailBtn")?document.querySelector("#ModalLikeCoctailBtn"):document.querySelector(`#likeBtn${n}`),l.classList.remove(o),l.classList.add(c),l.textContent=i)},_=(t,e,o,c,i)=>{i===k?s=0:i===h&&(s=1),t.target.classList.contains(e)?(t.target.textContent="Remove",i.push(c),localStorage.setItem(localStorage.key(s),JSON.stringify(i)),t.target.classList.toggle(o),t.target.classList.toggle(e)):t.target.classList.contains(o)&&(t.target.textContent="Add to",i.splice(i.indexOf(c),1),localStorage.setItem(localStorage.key(s),JSON.stringify(i)),t.target.classList.toggle(o),t.target.classList.toggle(e))},m=(t,e,o,c)=>{t.classList.toggle(e),o.classList.toggle(c)},g=t=>{const e=document.querySelector(".coctail-modal__list");for(const o in t)o.includes("strIngredient")&&null!==t[o]&&(e.innerHTML+=`<li><button class="coctail-modal__ingredient" type="button">${t[o]}</button></li>`)},u=(t,e)=>{t.classList.contains(e)?t.textContent="Add to favorite":t.textContent="Remove from favorite"},b=(t,e,o,c,i)=>{o||(o="sorry, we have no data :("),c||(c="sorry, we have no data :("),i||(i="sorry, we have no data :("),t.innerHTML=`<h3 class = "coctail-modal__coctail-name">${e}</h3>\n                        <p class = "coctail-modal__coctail-instruction">${o}</p>\n                        <ul class = "coctail-modal__list">\n                          <li><p class = "coctail-modal__list-item-data">Type: ${c}</p></li>\n                          <li><p  class = "coctail-modal__list-item-data">Alkoholic? - ${i}</p></li>\n                        </ul>\n                        <button class = "ingredient-modal__like-ingredient-btn" type="button" id="ModalLikeIngredientBtn">Add to favorite</button>\n                        <button class = "ingredient-modal__close-ingredient-btn" type="button"></button>\n                        `};let k=[];try{0!==JSON.parse(localStorage.getItem("favoriteCoctails")).length&&(k=JSON.parse(localStorage.getItem("favoriteCoctails")))}catch{localStorage.setItem("favoriteCoctails",JSON.stringify(k))}let h=[];try{0!==JSON.parse(localStorage.getItem("favoriteIngredients")).length&&(h=JSON.parse(localStorage.getItem("favoriteIngredients")))}catch{localStorage.setItem("favoriteIngredients",JSON.stringify(h))}(t=>{const e=getComputedStyle(t);l="320px"===e.width?3:"768px"===e.width?6:9})(e);for(let e=0;e<l;e+=1)r("https://www.thecocktaildb.com/api/json/v1/1/random.php").then((e=>{a+=1;const{strDrinkThumb:l,strDrink:s}=e.drinks[0];var p,y;p=s,y=l,t.innerHTML+=`<li class='coctails-section__coctail'>\n            <div class='coctails-section__coctail-container'>\n                <img class='coctails-section__coctail-img' srcset="${y}" alt="${p}">\n                <h3 class='coctails-section__coctail-name'>${p}</h3>\n                <div class="coctails-section__coctail-buttons-container">\n                    <button class="coctails-section__button coctails-section__learn-button" type="button">Learn more</button>\n                    <button class="coctails-section__button coctails-section__favorite-button coctails-section__like-button" type="button" id="likeBtn${a}">Add to</button>\n                </div>\n            </div>\n        </li>`,d(s,k,"coctails-section__like-button","coctails-section__dislike-button","Remove",a);document.querySelectorAll(".coctails-section__coctail-container").forEach((t=>{t.addEventListener("click",(t=>{const e=t.currentTarget.querySelector(".coctails-section__coctail-name").textContent;if(_(t,"coctails-section__like-button","coctails-section__dislike-button",e,k),t.target.classList.contains("coctails-section__learn-button")){const l=t.currentTarget.querySelector(".coctails-section__favorite-button").getAttribute("id");r(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${e}`).then((t=>{const s=t,{strDrinkThumb:p,strDrink:y,strInstructions:S}=s.drinks[0];var v,L,f;v=y,L=p,f=S,o.innerHTML=`<h3 class = "coctail-modal__coctail-name" >${v}</h3>\n                  <h4 class = "coctail-modal__coctail-description">Instractions:</h4>\n                  <p class = "coctail-modal__coctail-instruction">${f}</p>\n                  <img class='coctails-section__coctail-img' src="${L}" alt="${v}">\n                  <h4 class = "coctail-modal__coctail-description">Ingredients</h4>\n                  <p>Per cocktail</p>\n                  <ul class = "coctail-modal__list">\n                  </ul>\n                  <button class = "coctail-modal__like-coctail-btn" type="button" id="ModalLikeCoctailBtn">Add to favorite</button>\n                  <button class = "coctail-modal__close-modal-btn" type="button"></button>\n                </div>`;const q=document.querySelector(".coctail-modal__like-coctail-btn");d(y,k,"coctail-modal__like-coctail-btn","coctail-modal__dislike-coctail-btn","Remove from favorites",a),q.addEventListener("click",(t=>{_(t,"coctail-modal__like-coctail-btn","coctail-modal__dislike-coctail-btn",e,k),u(q,"coctail-modal__like-coctail-btn");const o=document.querySelector(`#${l}`);o.classList.toggle("coctails-section__like-button"),o.classList.toggle("coctails-section__dislike-button"),o.classList.contains("coctails-section__like-button")?o.textContent="Add to":o.textContent="Remove"})),m(c,"coctails-section__coctail-modal-backdrop--is-hidden",o,"coctails-section__coctail-modal--is-hidden");document.querySelector(".coctail-modal__close-modal-btn").addEventListener("click",(()=>{m(c,"coctails-section__coctail-modal-backdrop--is-hidden",o,"coctails-section__coctail-modal--is-hidden")})),g(s.drinks[0]);document.querySelectorAll(".coctail-modal__ingredient").forEach((t=>{t.addEventListener("click",(t=>{const e=t.target.innerText;r(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${e}`).then((t=>{const{strAlcohol:e,strDescription:o,strIngredient:c,strType:l}=t.ingredients[0];b(i,c,o,l,e);const s=document.querySelector(".ingredient-modal__like-ingredient-btn");d(c,h,"ingredient-modal__like-ingredient-btn","ingredient-modal__dislike-ingredient-btn","Remove from favorites",a),s.addEventListener("click",(t=>{_(t,"ingredient-modal__like-ingredient-btn","ingredient-modal__dislike-ingredient-btn",c,h),u(s,"ingredient-modal__like-ingredient-btn")}));const r=document.querySelector(".ingredient-modal__close-ingredient-btn");m(n,"coctails-section__ingredient-modal-backdrop--is-hidden",i,"coctails-section__ingredient-modal--is-hidden"),r.addEventListener("click",(()=>{m(n,"coctails-section__ingredient-modal-backdrop--is-hidden",i,"coctails-section__ingredient-modal--is-hidden")}))})).catch(alert.log)}))}))}))}}))}))})).catch(alert.log);
//# sourceMappingURL=favorite-coctails.fb0cb616.js.map
