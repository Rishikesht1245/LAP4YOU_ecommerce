// ============= ajax call for filtering products ========================//
function filter(filterBy, brandId){
  $.ajax({
    url:'/products',
    type:'patch',
    data : {
      filterBy : filterBy,
      brandId : brandId,
    },
    success : (res) => {
      swal.fire({
        toast:true,
        icon : 'success',
        position : 'top-right',
        showConfirmation : false,
        timer : 1000,
        animation : true,
        title : 'Filterd',
      });
      $('#productContainer').load(location.href + ' #productContainer'); 
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

function sortBy(order) {
  $.ajax({
    url: '/products',
    type: 'post',
    data: {
      sortBy: order,
    },
    success: (res) => {
      swal.fire({
        icon: 'success',
        toast: true,
        position: 'top-right',
        showConfirmation: false,
        timer: 1000,
        animation: true,
        title: 'Sorted',
      });

      // Store the selected sort option in local storage
      localStorage.setItem('selectedSort', order);

      // Reload the page
      window.location = '/products'
    },
  });
}

window.onload = function () {
  const selectedSort = localStorage.getItem('selectedSort');
  // Set the selected sort option in the UI
  if (selectedSort) {
    document.getElementById(selectedSort).checked = true;
  }
};




//================ AJAX Call for Seraching ===============================//

function search(){
  const searchInput = $('#searchInput').val();
  if(searchInput){
    $('#searchButton').html(
          `<button class="btn btn-sm" onclick="removeFilter('none')"> Remove Filter </button>`
          );
  }
  $.ajax({
    url:'/products',
    type : 'put',
    data : {
      searchInput : searchInput,
    },
    success: (res) => {
      $('#productContainer').load(location.href + ' #productContainer');
    }
  });
}