// ============= ajax call for filtering products ========================//
function filter(filterBy, brandId, listingName){
  $.ajax({
    url:'/products',
    type:'patch',
    data : {
      filterBy : filterBy,
      brandId : brandId,
      listingName : listingName,
    },
    success : (res) => {
      console.log(res.success)
      if(res.success == "clear"){
        $('#productContainer').load(location.href + ' #productContainer');
        $("#searchInput").val("");
      }else{
        $('#productContainer').load(location.href + ' #productContainer'); 
     }
      if(res.success == 0){
        $('#searchInput').val('');
      }
    }
  });
}



// ============= ajax call for removing filter [all products] =========================//

function removeFilter(filterBy){
  $.ajax({
    url : '/products',
    type : 'patch',
    data : {
      filterBy : filterBy,
    },
    success : (res) => {
      $('#productContainer').load(location.href + ' #productContainer');
      $('#searchInput').load(location.href + ' #searchInput');
    }
  })
}


//========================= ajax call for sorting ====================================//

function sortBy(event, order) {

  const liElements = document.querySelectorAll('.dropdown-item');
  liElements.forEach((li) => {
    li.classList.remove('active');
  });

  event.target.classList.add('active');

  $.ajax({
    url: '/products',
    type: 'post',
    data: {
      sortBy: order,
    },
    success: (res) => {
      $('#productContainer').load(location.href + ' #productContainer');
    },
  });
}






//================ AJAX Call for Seraching ===============================//

function search(listingName){
  let url;
  if(listingName == 'Our Collection'){
     url = '/products'
  }else if(listingName == 'GAMING'){
    url = '/categories/64888a004cb3b3a4b1bb8be3'
  }else if(listingName == 'STUDENT'){
    url = '/categories/648d930bca2707bb62f29e01'
  }else if(listingName == 'BUSINESS'){
    url = '/categories/648d9311ca2707bb62f29e06'
  }

  const searchInput = $('#searchInput').val();
  if(searchInput){
    $('#searchButton').html(
          `<button class="btn btn-sm" onclick="removeFilter('none')"> Remove Filter </button>`
          );
  }
  $.ajax({
    url: url,
    type : 'put',
    data : {
      searchInput : searchInput,
    },
    success: (res) => {
      $('#productContainer').load(location.href + ' #productContainer');
    }
  });
}