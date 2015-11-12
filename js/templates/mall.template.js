(function($, T) {
  T.cardMallTemplate = function(mall, id) {
    if(id == null || id == undefined) {
      id = mall.id;
    }
    return ( 
            '<article class="post tag-ad" id="mall:' + id +  '">' +
              '<h2 class="post-title">' +  
                '<a target="_blank">' + mall.name + '</a>' + 
              '</h2>' +
              '<div class="post-featured-image">' + 
              '<a class="thumbnail " target="_blank">' + 
                '<img class="mui-media-object"  src="' + mall.image_url + '" width="100%" height="400" alt="">' +
              '</a>' +
              '</div>' +
            '</article>' 
        );
  }
  
  T.collectMallTableViewTemplate = function(items, idStart) {
    if(!idStart) {
      idStart = 0;
    }
    var fragment, li, index;
    fragment = document.createDocumentFragment();
    for(var i = 0; i < items.length; i++) {
      index = idStart + i;
      li = document.createElement('div');
      li.className = "mui-table-view-cell";
      li.id = 'mall:' +  index;
      li.innerHTML = items[i].name;
      fragment.appendChild(li);
    }
    return fragment;
  }

})(mui, window.app.Template);