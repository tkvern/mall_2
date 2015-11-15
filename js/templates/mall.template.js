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
  
  T.brandMallTemplate = function(mall) {
    var header_img, header_content, 

    header_img = '<div class="header_img">' + 
                 '<img src="' + mall.image_url + '" />' +
                 '</div>';

    header_content = 
      '<div class="container">' +
         '<div class="row">' + 
            '<div class="col-xs-12">' + 
            '<div class="logotxt text-left"><h2><a href="#">' + mall.name + '</a></h2></div>' +
            '<div class="heart" id="heart" status="0"><i class="fa fa-heart-o fa-2x"></i></div>' +  
          '</div>' + 
        '</div>' +
      '</div>';
      
    return header_img + header_content;
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