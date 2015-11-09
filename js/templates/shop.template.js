(function($, T) {
  T.cardShopTemplate = function(shop, id) {
    if(id == null || id == undefined) {
      id = shop.id;
    }
    return ( 
            '<article class="post tag-ad" id="shop:' + id +  '">' +
              '<h2 class="post-title">' +  
                '<a target="_blank">' + shop.title + '</a>' + 
              '</h2>' +
              '<div class="post-featured-image">' + 
              '<a class="thumbnail " target="_blank">' + 
                '<img class="mui-media-object"  src="' + shop.image_url + '" width="100%" height="400" alt="">' +
              '</a>' +
              '</div>' +
            '</article>' 
        );
  }
})(mui, window.app.Template);