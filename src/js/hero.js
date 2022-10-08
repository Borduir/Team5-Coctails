'use strict';
const refst = {
    heroList: document.querySelector('.hero-list'),
    heroTitle: document.querySelector('.hero-text'),
    hero: document.querySelector('.hero'),
    select: document.querySelector('.hero-select'),
    isHiden: document.querySelector('.is-hiden'),
    heroItem: document.querySelectorAll('.hero-item'),
}
const {heroList, heroTitle,hero,select,isHiden,heroItem} = refst


const heroTitleImg = () =>{
    return `<div class="hero-container">
</div>`
}

function creaitMarkapArr(e) { 
    return e.map(e => {
        return `<li class=hero-item data-name=${e}>${e}</li>`
    });
    }
    
    const arrr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0']

    function creaitMarkap(e) { 
        return e.map(e => {
            return `<option class=hero-item value=${e}>${e}</option>`
        });
        }
      function clickHeroTitel(e){
        const target = e.target.dataset.name
        
        if(innerWidth < 767){
            console.log(e.target.value);
           }
        if(!target){
            return
        }
        console.log(target);

        

      }
    
        heroList.addEventListener('click',clickHeroTitel)
const hiden = creaitMarkap(arrr)
const markap = creaitMarkapArr(arrr)
 const heroWidth = heroTitleImg()

if(innerWidth > 767){
    isHiden.classList.add('is-hiden')
    heroList.insertAdjacentHTML('beforeend',markap.join(''))
    hero.insertAdjacentHTML('beforeend', heroWidth)
};

if(innerWidth < 767){
    isHiden.classList.remove('is-hiden')
    heroTitle.insertAdjacentHTML('beforebegin', heroWidth)
    select.insertAdjacentHTML('beforeend',hiden.join(''))
};


