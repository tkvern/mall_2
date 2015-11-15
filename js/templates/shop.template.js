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
  
  T.brandShopTemplate = function(shop) {
    var header_img, header_content, 
        location,
        business_hour;
        
    business_hour = shop.business_hour_start + ' - ' + shop.business_hour_end;

    header_img = '<div class="header_img">' + 
                  '<img src="' + shop.image_url + '" />' +
                 '</div>';

    header_content = 
      '<div class="container">' +
         '<div class="row">' + 
            '<div class="col-xs-12">' + 
            '<div class="logotxt text-left"><h2><a href="#">' + shop.title + '</a></h2></div>' +
            '<div class="heart" id="heart" status="0"><i class="fa fa-heart-o fa-2x"></i></div>' +  
						'<h2 class="shop-phone text-left"><a href="tel:'+ shop.phone_number +'">' + 
						  '<i class="fa fa-phone"></i>' + shop.phone_number + '</a><span></span></h2>' +
            '<h2 class="shop-phone text-left"><i class="fa fa-map-marker"></i>' + shop.address + '</a><span></span></h2>' + 
            '<h2 class="shop-phone text-left"><a href=""><i class="fa fa-clock-o"></i>' + business_hour + '</a><span></span></h2>' + 
          '</div>' + 
        '</div>' +
      '</div>';
      
    return header_img + header_content;
  }

  T.collectShopTableViewTemplate = function(items, idStart) {
    if(!idStart) {
      idStart = 0;
    }
    var fragment, li, index;
    fragment = document.createDocumentFragment();
    for(var i = 0; i < items.length; i++) {
      index = idStart + i;
      li = document.createElement('div');
      li.className = "mui-table-view-cell";
      li.id = 'shop:' +  index;
      li.innerHTML = items[i].title;
      fragment.appendChild(li);
    }
    return fragment;
  }
})(mui, window.app.Template);