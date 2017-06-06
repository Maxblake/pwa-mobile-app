
'use strict';

import idb from '../libs/idb';
//import DOMpurify from '../libs/purify.min.js';

class Detail {

  constructor(content) {
    this.content = content;
  }
   
  getDetail(id){
    
    idb.open('articles-db').then(function(db) {
      const tx = db.transaction('articles', 'readonly');
      const store = tx.objectStore('articles');
      return store.get(id);
    }).then((item)=>{
      item ? console.log('from db') : null
      this.render(item);
    });
  }

  getId(hash){
    return (hash.replace(/[\/]/, "")).replace(/[#]/, "");
  }

  render(item){
    
    if(!item){
      console.log('getting from network');
      this.fetchDetail(this.getId(window.location.hash));
      return;
      //Testfor this case by deleting an item and refreshing the detail page.
    }

    //this.sanitize(item.fields.body)
    //.then((body) => {
      
      this.content.innerHTML = `
        <section class="article demo-typography--section mdc-typography">
          <img src=${item.fields.thumbnail}>
          <h1 class="mdc-typography--headline"">${item.webTitle}</h1>
          <div class="mdc-typography--body1 mdc-typography--adjust-margin" >${item.fields.body}</div>
        </section>`
      ;
    //})

    //.then(this.ShowControls); // A hack: sanitizer not preserving video controll attributes
  }

  fetchDetail(id){

    // Rare Case: old bookmarked url
    // if no item, that means the old url and data misses from the database
    // use the id to fetch data online if (navigator.online) and render and save

    this.getJson(id)
    .then(res => res.json())
    .then(res => res.response.content)
    .then(content => this.render(content));
    // Could then store in db
  }

  /*sanitize(html) {
    return new Promise(function(resolve){
      resolve(
         DOMpurify.sanitize(html, {
          FORBID_TAGS: ['figure','figcaption']
        })
      );
    });
  }*/

  // Show Controls 
  ShowControls()  {
    const videos = document.querySelectorAll('video');
    if(videos.length > 0){
      videos.forEach(function(video){
        video.controls = true;
      });
    }
  }

  getJson(section){
    const key = 'a0f2219a-e62d-4c78-b0ac-f4f8717d3580';
    const url = "https://content.guardianapis.com/";
    return fetch(`${url}${section}?&show-fields=all&api-key=${key}`);
  }
}

export default Detail;

// TODO : write tests! 