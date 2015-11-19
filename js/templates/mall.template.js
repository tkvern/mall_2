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
                '<img class="mui-media-object"  src="' + app.imageUrl(mall.image_url) + '" width="100%" height="400" alt="">' +
              '</a>' +
              '</div>' +
            '</article>' 
        );
  }
  
  T.brandMallTemplate = function(mall) {
    var header_img, header_content; 
    var location = mall.lng + ',' + mall.lat + ',"' + mall.name + '"';

    header_img = '<div class="header_img">' + 
//               '<img src="' + app.imageUrl(mall.image_url) + '" />' +
                 '</div>';

    header_content = 
      '<div class="container">' +
         '<div class="row">' + 
            '<div class="col-xs-12">' + 
            '<div class="logotxt text-left"><h2><a href="#">' + mall.name + '</a></h2></div>' +
						'<h2 class="shop-phone text-left">'+
						  '<a href="tel:'+ mall.phone_number +'">' + 
						    '<i class="fa fa-phone"></i>' + mall.phone_number + 
						  '</a>' + 
						'</h2>' +
						'<h2 class="shop-phone text-left"' +
						  ' onclick="navigateWithMap(' + location + ')">' +
						  '<i class="fa fa-map-marker"></i>'+ mall.address + '</a><span></span>'+ 
						'</h2>' +
            '<div class="heart" id="heart" status="0"><i class="fa fa-heart-o fa-2x"></i></div>' +  
          '</div>' + 
        '</div>' +
      '</div>';
    console.log('header_content:' + header_content); 
    return header_img + header_content;
  }
  
  T.collectMallTableViewTemplate = function(items, idStart) {
    if(!idStart) {
      idStart = 0;
    }
    var fragment, li, index, ul;
    ul = document.createElement('ul');
    ul.className='mui-table-view';
    fragment = document.createDocumentFragment();
    fragment.appendChild(ul)
    for(var i = 0; i < items.length; i++) {
      li = sliderCellForMall(items[i], idStart + i)
      ul.appendChild(li);
    }
    return fragment;
  }  

  function sliderCellForMall(mall, id) {
    var li = document.createElement('li');
    li.className = 'mui-table-view-cell';
    li.id = '/grap.html?shop=' + mall.id + '&index:' +id;
    li.innerHTML = 
      '<div class="mui-slider-right mui-disabled">' + 
        '<a class="mui-btn mui-btn-red">取消关注</a>' + 
      '</div>' + 
      '<div class="mui-slider-handle">' + 
        mall.name + 
      '</div>';
    return li;
  }

})(mui, window.app.Template);