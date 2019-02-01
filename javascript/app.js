class Storage {
    constructor(key) {
      this.key = key;
    }
    getStorage() {
      const data = window.localStorage.getItem(this.key);
      if (data) {
        return JSON.parse(data);
      }
      return data;
    }
    save(data) {
      window.localStorage.setItem(this.key, JSON.stringify(data))
    }
  }

const storage = new Storage('app-state');
const wrapper = document.querySelector('.js-wrapper');
const newDeck = document.querySelector('.js-newDeck');
const drawCard = document.querySelector('.js-DrawCard');
const header = document.querySelector('.grayHeader');





const getDeck = (deck_count, cb) => {
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deck_count}`;
  
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener('load', (response) => {
      const data = JSON.parse(response.currentTarget.response); 

        // console.log(data);    
        
        cb(data);
      });
        
    request.send();
  }

const getCard = (deck_id, cb) => {

    const url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener('load', (response) => {
      const data = JSON.parse(response.currentTarget.response); 
        // console.log(data);         
        cb(data);
      });
        
    request.send();
  }

let state = {
    deckId : null,
    remaining: null,
    cards: [],
}

const cardInHtml = (state, idx) => {
    return  `<div class="column ui cards">
    <div class="image">
      <img src="${state.cards[idx].image}" data-index="${idx}">
    </div>
    <div class="content">
      <a class="header">${state.cards[idx].value} ${state.cards[idx].suit}</a>
    </div>
  </div>`
}

const addHeader = (state) => {
    header.innerHTML= `<h1 class="ui header"> My Deck Of Cards</h1>   

    <button class="hide DrawCard ui button js-DrawCard">Draw Card</button>
    <button class="newButton ui button js-newDeck">New Deck</button>
    
    <h3 class="ui header"> Deck_ID:  ${state.deckId}  </h3>
    <h3 class="ui header"> Cards Remaining: ${state.remaining}  </h3>
    `
}

const OverlayedCardInHtml = (state, idx) => {
    return  `<div class="column ui cards overlay">
    <div class="image overlay">
      <img src="${state.cards[idx].image}" data-index="${idx}">
    </div>
    <div class="content">
      <a class="header">${state.cards[idx].value} ${state.cards[idx].suit}</a>
    </div>
  </div>`
}

const OneCardInHtml = (state, idx) => {
    return  `<div class="column ui fluid card">
    <div class="content">
    <h3 class="ui header centered">${state.cards[idx].value} ${state.cards[idx].suit}</h3>
    </div>
    <div class="image">
      <img src="${state.cards[idx].image}" data-index="${idx}">
    </div>
  </div>`
}

const render = state => {

    let allHtml = '';

    if (state.deckId !== null) {
       addHeader(state);
    }

        for (let i =0; i < state.cards.length; i++) {
         allHtml += cardInHtml(state, i);
      console.log('im working')
    }

    wrapper.innerHTML = allHtml;  

}

const renderClickedCard = (state,idx) => {

    let allHtml = '';

    if (state.deckId !== null) {
       addHeader(state);
    }

    const idxToNum = parseInt(idx, 10);

        for (let i =0; i < state.cards.length; i++) {
            // console.log('i: ', i);
            // console.log('index: ', idxToNum);
            if ( i === idxToNum) {
                allHtml += OneCardInHtml(state, i);
                console.log('i === idx', i, idx)
            }
         allHtml += OverlayedCardInHtml(state, i);

    }
    wrapper.innerHTML = allHtml;  
}



newDeck.addEventListener('click', e => {
    
    getDeck(1, data => {
     
        const deckId = data.deck_id; 
        const remaining = data.remaining;
        state.deckId = deckId;
        state.remaining = remaining;

        storage.save(state);
        render(state);

        // console.log('data: ',data);
        // console.log('deckId: ',deckId);
        // console.log('deckIdInState: ',state.deckId);
        // console.log('remaining in State: ', state.remaining);
    })
})  


header.addEventListener('click', e=> {

    if (e.target.matches('.js-DrawCard')){
    
    getCard(state.deckId, data => {
        state.remaining = data.remaining;
        state.deckId = data.deck_id;
        for (let i = 0; i<data.cards.length; i++) {
            state.cards.unshift(data.cards[i]); 
            if (state.remaining === 0) {
                alert('Deck is Empty. start new Deck');
            }
            console.log(state);
        }
        storage.save(state);
        render(state);    
    })}  
})


wrapper.addEventListener('click', e => {
    if (e.target.matches('img')){
        // console.log(e.target);
        const imgTarget = e.target;
        const imgIdx = imgTarget.getAttribute('data-index');
        console.log('img target is : ', imgTarget);
        console.log(state.cards[imgIdx].value);
        console.log(state.cards[imgIdx].suit);
        renderClickedCard(state, imgIdx);   
        // wrapper.innerHTML = cardInHtml(state, imgIdx);    
    }

})


const stored_state = storage.getStorage();
  if (stored_state) {
    // If there is then apply that to my state in Memory
    state = stored_state;
  }
// render(state);
