var app = {};


function init() {
  fetch('../../conf/games/index.json')
  .then(response => response.json())
  .then((itemsjson) => {
    fetch('../../conf/launchers.json')
    .then(response2 => response2.json())
    .then((json2) => {
      app.items = itemsjson;
      var items = itemsjson;
      var keywords = {};
      app.unchecked = 0;

      for( var i=0; i<items.length;i++) {
        if( items[i].year ) {
          items[i].keywords.push( " Year: " +  items[i].year );
        }
        if( items[i].system ) {
          items[i].keywords.push( " System: " +  items[i].system );
        }
        if( items[i].publisher ) {
          items[i].keywords.push( " Publisher: " +  items[i].publisher );
        }
        if( items[i].publisher ) {
          items[i].keywords.push( " Series: " +  items[i].series );
        }
      }
      for( var i=0; i<items.length;i++) {
        var item = items[i];

        if( !item.status ) {
          app.unchecked++;
          continue;
        }
        if( item.status != "checked" ) {
          app.unchecked++;
          continue;
        }


        for( var j=0; j<item.keywords.length;j++) {
          var kw = item.keywords[ j ];

          if( ! keywords[ kw ] ) { keywords[ kw ] = [] ; }
          keywords[ kw ].push( item );
        }


      }

      app.keywords = keywords;
      app.keywordNames = Object.getOwnPropertyNames( keywords );


      app.launchers = json2;

      initGUI();
    })
  })

}

function changeTheme( theme ) {
  document.getElementById("styles").href = "../../conf/themes/" + theme + "/style.css";

}


function disableGUI() {
  app.gui.mainDiv.className = "disable";
}

function enableGUI() {
  app.gui.mainDiv.className = "maindiv";
}


function createPreview() {

  const img = document.createElement("img");
  img.src = "../../conf/games/unknown.png";
  img.className = "previewImage";

  app.gui.previewImg = img;

  var text;

  const label = document.createElement("div");
  label.className = "label";
  app.gui.previewLabel = label;
  text = document.createTextNode( "unknown" );
  app.gui.previewLabelText = text;

  const label2 = document.createElement("div");
  label2.className = "label";
  app.gui.previewLabel2 = label2;
  text = document.createTextNode( "unknown" );
  app.gui.previewLabelText2 = text;

  const label3 = document.createElement("div");
  label3.className = "label";
  app.gui.previewLabel3 = label3;
  text = document.createTextNode( "unknown" );
  app.gui.previewLabelText3 = text;

  app.gui.previewDiv.appendChild( img );
  app.gui.previewDiv.appendChild( label );
  app.gui.previewDiv.appendChild( label2 );
  app.gui.previewDiv.appendChild( label3 );
  label.appendChild( app.gui.previewLabelText );
  label2.appendChild( app.gui.previewLabelText2 );
  label3.appendChild( app.gui.previewLabelText3 );
}


function isBelowViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.bottom > (window.innerHeight || document.documentElement.clientHeight)
        );
}


function isAboveViewport(element) {
    const rect = element.getBoundingClientRect();
    const parentRect = app.gui.mainDiv0.getBoundingClientRect();
    return (
        rect.top < parentRect.top
    );
}


function selectCategory( el, itemIx ) {

  var item = app.keywordNames [ itemIx ];

  app.gui.selectedCatEl = el;

  for( var i=0; i<app.elements.length;i++) {
    var thisEl = app.elements[ i ];
    if( thisEl.id != el.id ) {
      thisEl.className = "linedivclass";
    }
    else {
      thisEl.className = "linedivclass_select";
    }
  }

  var max = 10000;
  while( isBelowViewport( el ) && max-- >0) {
      app.gui.mainDiv0.scrollTop++;
  }
max = 10000;
  while( isAboveViewport( el ) && max-- >0  ) {
      app.gui.mainDiv0.scrollTop--;
  }


  app.currentItem = item;
  app.currentItemIx = itemIx;

  app.gui.previewLabelText.nodeValue  = item;
  app.gui.previewLabelText2.nodeValue  = "";
  app.gui.previewLabelText3.nodeValue  = "";

  app.gui.previewImg.src = "../../conf/games/unknown.png";

}


function selectGame( el, itemIx ) {

  var item = app.activeItems [ itemIx ];

  app.gui.selectedGameEl = el;

  for( var i=0; i<app.elements.length;i++) {
    var thisEl = app.elements[ i ];
    if( thisEl.id != el.id ) {
      thisEl.className = "linedivclass";
    }
    else {
      thisEl.className = "linedivclass_select";
    }
  }

  var max = 10000;
  while( isBelowViewport( el ) && max-- >0) {
      app.gui.mainDiv0.scrollTop++;
  }
max = 10000;
  while( isAboveViewport( el ) && max-- >0  ) {
      app.gui.mainDiv0.scrollTop--;
  }


  app.currentItem = item;
  app.currentItemIx = itemIx;

  app.gui.previewLabelText.nodeValue  = item.title;
  app.gui.previewLabelText2.nodeValue  = "Year - " + item.year;
  app.gui.previewLabelText3.nodeValue  = "Publisher - " + item.publisher;

  if( item.picture ) {
      var pic  = item.picture;
      pic = pic.replaceAll("%GID",item.gameid);
      app.gui.previewImg.src = "../../conf/games/media/" + pic;

      app.gui.previewImg.onload = function() {

        var factor = this.height / this.width;

        const rect = app.gui.previewDiv.getBoundingClientRect();
        var w = (rect.right - rect.left) * .90;

        this.style.height = Math.floor(factor * w) + "px";
        this.style.width  = Math.floor(factor * w) + "px";

     };

  }
  else {
    app.gui.previewImg.src = "../../conf/games/unknown.png";
  }
}

function onGoCategory( event ) {

//  var index = event.currentTarget.dataset.itemIndex;
//  selectCategory( event.currentTarget, index );

  var index = app.currentItemIx;
  if( event ) {
    console.log("start with event");
    index = event.currentTarget.dataset.itemIndex;
  }

  //var index = event.currentTarget.dataset.itemIndex;
  var item = app.activeItems [ index ];

  buildGUIGameItems( item );


}


function onStartGame( event ) {


  var index = app.currentItemIx;
  if( event ) {
    console.log("start with event");
    index = event.currentTarget.dataset.itemIndex;
  }
  var items = app.activeItems;
  var launchers = app.launchers;

  var item = items [ index ];
  if( item.action ) {
    if( item.action = "categories") {
      buildGUICategoryItems();
    }
    return;
  }

  var launcher = item.launch;
  var lpath = "";
  var lexe = "";
  var lmode = "";
  var lparam = [];
  for ( var j=0; j<launchers.length; j++) {
    if( launchers[ j ].id.toUpperCase() == launcher.toUpperCase() ) {
      lmode = launchers[ j ].mode;
      lpath = launchers[ j ].path;
      lexe = launchers[ j ].exe;
      lparam = launchers[ j ].param;
      break;
    }
  }

  //disableGUI();

  if( lmode == "0" ) {
      var pep = { mode: lmode, path: lpath, exe: lexe, param: lparam, gameid: item.gameid };

      window.electronAPI.startProcess( pep );
  }
  else if( lmode == "1" ) {
      var param = item.param;
      if( ! param ) {
        param = [];
      }
      var pep = { mode: lmode, path: item.path, exe: item.exe, param: param };

      window.electronAPI.startProcess( pep );
  }
}

function scrollDown( cnt ) {
  for ( var i=0; i<cnt; i++) {

      if( app.currentItemIx  < (app.activeItems.length - 1) ) {
        app.currentItemIx ++;
        var el = app.elements[ app.currentItemIx ];
        if( app.mode == "games" ) {
            selectGame( el, app.currentItemIx );
        }
        else {
          selectCategory( el, app.currentItemIx );
        }
      }
  }
}


function scrollUp( cnt ) {
  for ( var i=0; i<cnt; i++) {
    if( app.currentItemIx  > 0 ) {
        app.currentItemIx --;
        var el = app.elements[ app.currentItemIx ];
        if( app.mode == "games" ) {
            selectGame( el, app.currentItemIx );
        }
        else {
          selectCategory( el, app.currentItemIx );
        }

    }
  }
}

function KeyHandler(event) {

  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
      case "ArrowDown":
        scrollDown(1);
        event.preventDefault();
        break;
      case "ArrowUp":
        scrollUp(1);
        event.preventDefault();
        break;
      case "PageDown":
        scrollDown(10);
        event.preventDefault();
        break;
      case "PageUp":
        scrollUp(10);
        event.preventDefault();
        break;
      case "Enter":
      case " ":
          if( app.mode == "games" ) {
            onStartGame( null );
          }
          else {
            onGoCategory( null );
          }
          event.preventDefault();
        break;

  }

};


function buildGUIGameItems( cat ) {

  app.mode = "games";
  app.gui.mainDiv.innerHTML = '';

  app.elements = [];

  var items = [];


  for( var i=0; i< app.items.length ; i++ ) {
    var game = app.items[ i ];
    if( cat.tag == "!UNTESTED!") {
      if( !game.status ) {
        items.push( app.items[ i ]);
        continue;
      }
      else if( game.status != "checked" ) {
        items.push( app.items[ i ]);
        continue;
      }
    }
    if( !game.status ) {
      continue;
    }
    if( game.status != "checked" ) {
      continue;
    }
    if ( game.keywords.indexOf( cat.tag ) >-1 ) {
      items.push( app.items[ i ]);
    }
    else if ( game.series == cat.tag || game.system == cat.tag || game.year == cat.tag || game.publisher == cat.tag) {
      items.push( app.items[ i ]);
    }
    else if ( cat.tag == "*" ) {
      items.push( app.items[ i ]);
    }
  }


  items.sort(function(a, b) {
    if ( a.title < b.title ) {
      return -1;
    }
    else if( a.title == b.title ) {
      return 0;
    }

    return 1;
  });
  items.unshift( { "title":"<UP>", "action":"categories" });

  app.activeItems = items;

  for( var i=0; i< items.length ; i++ ) {
    var item = items [ i ];

    var lineDiv = document.createElement("div");
    lineDiv.className = "linedivclass";
    lineDiv.id = "linediv__" + i;
    app.elements.push( lineDiv );

    var string = item.title;
    if( item.publisher ) {
      string += " (" + item.publisher + ")";
    }
    if( item.year ) {
      string += " [" + item.year + "]";
    }
    if( item.system ) {
      string += " - " + item.system;
    }

    var text = document.createTextNode( string );

    lineDiv.appendChild( text );
    lineDiv.dataset.itemIndex = i;
    lineDiv.addEventListener('click', function handleClick(event) {

      onStartGame( event );

    });



    function handleHover(event) {

        if( !app.mouseMove ) {
          return;
        }
        var index = event.currentTarget.dataset.itemIndex;
        selectGame( event.currentTarget, index );

        app.mouseMove = false;

    }

    lineDiv.addEventListener('mouseover', handleHover );
    app.gui.mainDiv.appendChild( lineDiv );

  }/* end loop to add elements on screen */



  selectGame( app.elements[0] , 0 );


}



function buildGUICategoryItems() {

  app.mode = "keywords";
  app.gui.mainDiv.innerHTML = '';

  app.elements = [];

  var kws = app.keywordNames;
  //app.keywords = keywords;
  //app.keywordNames = Object.getOwnPropertyNames( keywords );
  app.activeItems = [];

  for( var i=0; i< kws.length ; i++ ) {
    app.activeItems.push( {
      "title": kws[i].replaceAll("_"," "),
      "count": app.keywords[ kws[i] ].length,
      "tag": kws[i]
    } );
  }

  var items = app.activeItems;

  items.sort(function(a, b) {
    if ( a.title < b.title ) {
      return -1;
    }
    else if( a.title == b.title ) {
      return 0;
    }

    return 1;
  });

  app.activeItems.unshift( {
    "title": "All Games",
    "count": app.items.length - app.unchecked,
    "tag": "*"
  } );

  if( app.unchecked > 0 ) {
    app.activeItems.push( {
      "title": "Untested",
      "count": app.unchecked,
      "tag": "!UNTESTED!"
    } );
  }


  for( var i=0; i< items.length ; i++ ) {
    var item = app.activeItems [ i ];

    var lineDiv = document.createElement("div");
    lineDiv.className = "linedivclass";
    lineDiv.id = "linediv__" + i;
    app.elements.push( lineDiv );

    var string = item.title;
    string += " ["+item.count+" game";
    if( item.count > 1 ) { string+="s";}
    string += "]";

    var text = document.createTextNode( string );

    lineDiv.appendChild( text );
    lineDiv.dataset.itemIndex = i;
    lineDiv.addEventListener('click', function handleClick(event) {

        onGoCategory( event );

    });


    function handleHoverCategory(event) {

        if( !app.mouseMove ) {
          return;
        }

        var index = event.currentTarget.dataset.itemIndex;
        selectCategory( event.currentTarget, index );


        app.mouseMove = false;

    }

    lineDiv.addEventListener('mouseover', handleHoverCategory );
    app.gui.mainDiv.appendChild( lineDiv );

  }/* end loop to add elements on screen */



  selectCategory( app.elements[0] , 0 );



}


function initGUI() {

  changeTheme("redglow");

  app.gui = {};

  //app.items.unshift({"title":"[Categories]","picture":"categories.png", "syscmd":"categories" })

  const titleDiv0 = document.createElement("div");
  titleDiv0.className = "titlediv";
  app.gui.titleDiv0 = titleDiv0;

  const mainDiv0 = document.createElement("div");
  mainDiv0.className = "maindiv";
  app.gui.mainDiv0 = mainDiv0;

  const previewDiv0 = document.createElement("div");
  previewDiv0.className = "previewdiv";
  app.gui.previewDiv0 = previewDiv0;

  const titleDiv = document.createElement("div");
  titleDiv.className = "padding";
  app.gui.titleDiv = titleDiv;

  const mainDiv = document.createElement("div");
  mainDiv.className = "padding";
  app.gui.mainDiv = mainDiv;

  const previewDiv = document.createElement("div");
  previewDiv.className = "padding";
  app.gui.previewDiv = previewDiv;

  document.addEventListener('keydown', KeyHandler, false);
  app.mouseMove = false;
  mainDiv0.addEventListener('mousemove', e => {
    app.mouseMove = true;
  });


  document.body.appendChild( titleDiv0 );
  document.body.appendChild( mainDiv0 );
  document.body.appendChild( previewDiv0 );

  titleDiv0.appendChild( titleDiv );
  mainDiv0.appendChild( mainDiv );
  previewDiv0.appendChild( previewDiv );

  createPreview();

  buildGUICategoryItems();
  //buildGUIGameItems();
}


window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM loaded');
    init();
  });
