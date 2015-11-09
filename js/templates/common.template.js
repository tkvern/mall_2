(function($, T){
   T.createRowBasedFregment = function(objects, subCreator, idStart) {
     var use_start = true;
    if(idStart == null || idStart == undefined) {
      use_start = false;
    }
    var fragment = document.createDocumentFragment();
    var parentDiv, div;
    parentDiv = document.createElement('div');
    parentDiv.className = 'row';
    for (var i = 0; i < objects.length; i++) {
      div = document.createElement('div');
      div.className = 'col-xs-12 col-md-6';
      div.innerHTML = subCreator(objects[i], use_start ? idStart+i : null);
      parentDiv.appendChild(div);
    }
    fragment.appendChild(parentDiv);
    return fragment;
  }
})(mui, window.app.Template);
