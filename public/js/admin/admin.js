// ============================= BANNER  ===========================

// banners making api call for delete and changeActivity for Banner
//Change Activity
function changeActivity(id, active){
  $.ajax({
    url:'/admin/banner_management',
    type: 'patch',
    data: {bannerID: id, currentActivity : active,},
    success : (res)=>{
      $("#" + id).load(location.href + " #" + id);
    },
  });
}

// delte Banner
function deleteBanner(id){
  $.ajax({
    url:'/admin/banner_management',
    type:'delete',
    data : {bannerID : id},
    success: (res)=> {
      $("#" + id).load(location.href + " #" + id);
    },

  });
}




// ========================= CUSTOMER CHANGE ACCESS ===================
function changeAccess(id, access){
  $.ajax({
    url : '/admin/customer_management',
    type : 'patch',
    data : {
      userId : id,
      currentAccess : access,
    },
    success : (res) => {
     // Update the specific element within the container
     $("#" + id).load(location.href + " #" + id);
    }
  });
}

// ====================== SWEET ALERT CONFIRMATION ======================
function showConfirmation(e,itemName,action) {
  e.preventDefault();
  const name=itemName
  console.log('Reached edit page')
  var url = e.currentTarget.getAttribute('href')
  
  Swal.fire({
      icon: 'question',
      title:"<h5 style=color='white'>"+ `Are you sure to ${action} ${name} ?`+"</h5>",
      showCancelButton: true,
      background:'white',
      iconColor:'blue',
      confirmButtonColor: 'green',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
  }).then((result) => {
      if (result.value) {
          window.location.href=url;
        }
  })
}