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
//=======================================================================


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
};

//====================IMAGE PREVIEWS ============================
        function thumbnailPreview(event){
          const thumbnailPreview = document.getElementById("thumbnail-preview");
          // Clear previous previews
          thumbnailPreview.src = '';
          // Thumbnail preview
          if (event.target.files) {
            const thumbnailUrl = URL.createObjectURL(event.target.files[0]);
            thumbnailPreview.src = thumbnailUrl;
          }
        }

        function frontImagePreview(event){
          const frontPreview = document.getElementById("front-preview");
          frontPreview.src = '';
          if(event.target.files){
            frontPreview.src = URL.createObjectURL(event.target.files[0]);
          }
        }

        function imagesPreview(event){
            for(let i = 1; i <= 3; i++){
              var imagePreview = document.getElementById("images"+i);
              imagePreview.src = '';
              if(event.target.files){
                imagePreview.src = URL.createObjectURL(event.target.files[i-1]);
              }
            }
        }

  // banner preview
        function bannerPreview(event){
          console.log('reached')
          const banner_preview = document.getElementById('banner-preview');
          banner_preview.src = '';
          if(event.target.files){
            banner_preview.src = URL.createObjectURL(event.target.files[0]);
          }
        }
//===========================================================================