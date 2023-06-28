// ============================= BANNER  ===========================

const orderCLTN = require("../../../models/users/order");

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
function showConfirmation(e, itemName, action) {
  e.preventDefault();
  const name = itemName;

  Swal.fire({
    title: `<h5 style="color: white">Are you sure to ${action} ${name}?</h5>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    confirmButtonColor: '#4CAF50',
    cancelButtonText: 'No',
    cancelButtonColor: '#d33',
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
    },
    background: '#333',
    confirmButtonClass: 'btn-lg btn-success',
    cancelButtonClass: 'btn-lg btn-danger',
  }).then((result) => {
    if (result.isConfirmed) {
      const url = e.currentTarget.getAttribute('href');
      window.location.href = url;
    }
  });
}


function showFormConfirmation(e, itemName, action) {
  e.preventDefault();
  const name = itemName;
  
  const form = e.target.form;

  Swal.fire({
    title: `<h5 style="color: white">Are you sure to ${action} ${name}?</h5>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    confirmButtonColor: '#4CAF50',
    cancelButtonText: 'No',
    cancelButtonColor: '#d33',
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
    },
    background: '#333',
    confirmButtonClass: 'btn-lg btn-success',
    cancelButtonClass: 'btn-lg btn-danger',
  }).then((result) => {
    if (result.isConfirmed && form) {
      form.submit();
    }
  });
}




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



// ==================== Deliver Order ======================================
function deliverOrder(orderId, i){
  $.ajax({
    url : '/admin/orders',
    method : 'patch',
    data : {
      id : orderId
    },
    success : (res) =>{
      if(res.data.delivered === 1){
        $("#deliver" + i).load(location.href + " #deliver" +i);
      }
    }
  });
}

// cancel order api call
function cancelOrder(orderId){
  console.log("Reached");
  $.ajax({
    url : '/admin/orders/cancel/' + orderId,
    method : "patch",
    success : (res) => {
      if(res.success.message === 'cancelled'){
        $("#orderDetails").load(location.href + " #orderDetails");
        Swal.fire({
          toast: true,
          icon: "success",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Order cancelled",
        });
      }
    },
  });
}

//=============== PRINT INVOICE ================================
function printInvoice(id){
  const printContents = document.getElementById(id).innerHTML;
  let originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
}