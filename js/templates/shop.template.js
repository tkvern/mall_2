(function($, app, T) {
  T.cardShopTemplate = function(shop, id) {
    if(id == null || id == undefined) {
      id = shop.id;
    }
    return ( 
            '<article class="post tag-ad" id="/plus/merchant.html#shops/' + shop.id +  '/coupons" data-index="'+ id + '">' +
              '<h2 class="post-title">' +  
                '<a target="_blank">' + shop.title + '</a>' + 
              '</h2>' +
              '<div class="post-featured-image">' + 
              '<a class="thumbnail " target="_blank">' + 
                '<img class="mui-media-object"  src="' + app.imageUrl(shop.image_url) + '" width="100%" height="400" alt="">' +
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
    var location = shop.lng + ',' + shop.lat + ',' + shop.title;

    header_img = '<div class="header_img">' + 
                 '</div>';

    header_content = 
      '<div class="container">' +
         '<div class="row">' + 
            '<div class="col-xs-12">' + 
            '<div class="logotxt text-left"><h2><a href="#">' + shop.title + '</a></h2></div>' +
            '<div class="heart" id="heart" status="0"></div>' +  
						'<h2 class="shop-phone text-left"><a href="tel:'+ shop.phone_number +'">' + 
						  '<i class="fa fa-phone"></i>' + shop.phone_number + '</a><span></span></h2>' +
            '<h2 class="shop-phone text-left" onclick="navigateWithMap(' + location + ')">' +
              '<i class="fa fa-map-marker"></i>' + shop.address + '</a>' +
            '</h2>' +
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
    var fragment, li, index, ul;
    ul = document.createElement('ul');
    ul.className='mui-table-view';
    fragment = document.createDocumentFragment();
    fragment.appendChild(ul);
    for(var i = 0; i < items.length; i++) {
      li = sliderCellForShop(items[i], idStart + i);
      ul.appendChild(li);
    }
    return fragment;
  }

  function sliderCellForShop(shop, id) {
    var li = document.createElement('li');
    li.className = 'mui-table-view-cell';
    li.id = '/plus/merchant.html#shops/' + shop.id + '/coupons';
    li.setAttribute('data-index', id);
    li.innerHTML = 
      '<div class="mui-slider-right mui-disabled">' + 
        '<a class="mui-btn mui-btn-red">取消关注</a>' + 
      '</div>' + 
      '<div class="mui-slider-handle">' + 
        shop.title + 
      '</div>';
    return li;
  }
})(mui, window.app, window.app.Template);