
var app = (function() {
  
  'use strict';

  // Globals
  var grid = document.getElementById("grid");
  var endpoint = 'https://content.guardianapis.com/';
  var key = 'a0f2219a-e62d-4c78-b0ac-f4f8717d3580';
  
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }
  
  // Use the switch for better versioning
  var dbPromise = idb.open('articles-db', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('articles')) {
      console.log('Creating articles object store');
      var store = upgradeDb.createObjectStore('articles', {keyPath: 'id'});
      console.log('Creating a section index');
      store.createIndex('section', 'sectionId', {unique: false});  
    }
  });
  
  function init(){
    
    getSection(section(window.location.hash));

    window.onhashchange = function(){
      getSection(section(window.location.hash));
    }
  }
  
  function section(hash){
    return (hash.replace(/[\/]/, ""))
    .replace(/[#]/, ""); // Fix this ugly code..regex
  }

  function getSection(section){
    
    section = section.length === 0 ? 'world' : section;

    var range = IDBKeyRange.only(section);

    dbPromise.then(function(db) {
      var tx = db.transaction('articles', 'readonly');
      var store = tx.objectStore('articles');
      var index = store.index('section');
      return index.getAll(range);
    }).then(function(items) {    
      items.length === 0 ? getData(section) : render(items, true);
    });
  }


  function updateSection(){
    //if network, delete section, getSection
    if(navigator.online){
      
    }
  }

  function updateAllSections(){
    //if network, [sections].forEach(delete or clearAll), [sections].forEach(getSection)
  }

  function getData(section){
    getJson(section)
    .then(readAsJson)
    .then(extract)
    .then(render)
    .then(addToDb)
    .catch(logError)
  }

  function getJson(section){
    return fetch(endpoint+section+"?&show-fields=all&api-key="+key);
  }

  function readAsJson(response) { 
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json()
  }

  function extract(result){
    return result.response.results;
  }

  function render(data, fromDb){  

    var str = '';

    data.forEach(function(el){ 
      str += '<div class="grid-cell mdc-elevation--z1 mdc-layout-grid__cell">'+
      '<img src='+el.fields.thumbnail+'>'+
      '<a href='+'pages/detail.html?id='+el.id+'>'+
      '<p class="mdc-typography--body1">'+el.webTitle+'</p>'+
      '</a></div>';
    });
 
    grid.innerHTML = str;
    
    if(fromDb){
      console.log('from db')     
    }else{
      console.log('from network')
      return data; // return data to be added to database
    }
  }

  function addToDb(items){
    
    dbPromise.then(function(db) {
      var tx = db.transaction('articles', 'readwrite');
      var store = tx.objectStore('articles');
      items.forEach(function(item){
        store.put(item); // put vs add : use put --no errors
      })
      return tx.complete;
    }).then(function() {
      console.log('items added!'); //use a snackbar
    });
  }

  function logError(){
    console.log('Looks like there was a problem: \n', error);
  }

  return {
    init: (init)
  };
})();


app.init();



/*try to Save the images as blobs*/