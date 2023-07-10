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
      $("." +id).load(location.href + " ."+id )
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
    const paymentMethod = $('input[name="paymentMethod"]:checked').val();
    if (result.isConfirmed && paymentMethod =='RazorPay') {
      const formData = $('#checkout-form').serialize();

      // ajax call to check out page
      $.ajax({
        url : '/users/cart/checkout',
        method : 'POST',
        data : formData,
        success : (res) => {
          const order = JSON.parse(res.order);
          console.log('order');
          console.log(order.receipt);
           if(paymentMethod == 'RazorPay' && order){
                var options = {
                  "key": "rzp_test_52pMKUsVhUtk2U",
                  "amount": order.amount, 
                  "currency": "INR",
                  "name": "LAP4YOU", //your business name
                  "description": "Test Transaction",
                  "image": "https://unsplash.com/s/photos/laptop",
                  "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                  "callback_url":`/users/cart/checkout/${order.receipt}`,
                  "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                      "name": "LAP4YOU eCommerce", //your customer's name
                      "email": "lap4you.ecommerce@gmail.com",
                      "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
                  },
                  "notes": {
                      "address": "Razorpay Corporate Office"
                  },
                  "theme": {
                      "color": "#3399cc"
                  }
              };

              var rzp1 = new Razorpay(options);
              rzp1.on('payment.failed', function (response) {
                  console.log("paymentfialed");
              });
              rzp1.open();
            }
        }  
        
      });
      
    } if(result.isConfirmed && paymentMethod!= 'RazorPay'){
      form.submit();
    }
  });
}

function showProductConfirmation(e, element, itemName, action) {
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
     // Get the href value from the element's href attribute
     const href = element.getAttribute('href');
     // Route to the href
     window.location.href = href;
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



// ==================== Deliver, out for delivery, and refund  Order ======================================
function ChangeOrderStatus(orderId, i, status, delivered, price){
  console.log(price);
  let deliveredOn = delivered ? Date.now() : null;
  Swal.fire({
    title: `<h5 style="color: white">Are you sure to make the status ${status} </h5>`,
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
    if(result.isConfirmed){
      $.ajax({
        url : '/admin/orders',
        method : 'patch',
        data : {
          id : orderId,
          status : status,
          delivered : delivered,
          deliveredOn : deliveredOn,
          price : price,
        },
        success : (res) =>{
          if(res.data.delivered === 1){
            $("#deliver" + i).load(location.href + " #deliver" +i);
          }
        }
      });
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


// ==================== ADD COUPON ==============================
  function addCoupon(event) {
    event.preventDefault();
    console.log('Reached addCoupon');
    const form = event.target.form;

    const productCheckBoxes = $('input[type="checkbox"]:checked');
    const selectedProducts = Array.from(productCheckBoxes).map(checkBox => checkBox.value);

    const selectedProductsInput = $('#selectedProducts');
    selectedProductsInput.val(JSON.stringify(selectedProducts));
    form.submit();
  };


  function editCoupon(event) {
    event.preventDefault();
    console.log('Reached edit coupon');
    const form = event.target;
  
    const productCheckBoxes = $('input[type="checkbox"]:checked');
    const selectedProducts = Array.from(productCheckBoxes).map(checkBox => checkBox.value);
  
    const selectedProductsInput = $('#selectedProducts');
    selectedProductsInput.val(JSON.stringify(selectedProducts));
    
    form.submit();
  }
  
// =======================MANAGER SECTION ==============================================

  // ===================== MANAGER CHANGE ACCESS ========================================
  function changeMangerAccess(id, access){
   
    $.ajax({
      url: '/admin/manager_management/'+id,
      type: "patch",
      data:{
        id,
        currentAccess : access,
      },
      success: (res) => {
        $("#" +id).load(location.href + " #" +id);
      }
    });
  }


  // manager roles check boxes converting to a single array before submitting
  function addManager(event) {

    event.preventDefault();
    const form = event.target.form;
    console.log(form);

    const roleCheckBoxes = $('input[type="checkbox"]:checked');
    const selectedRoles = Array.from(roleCheckBoxes).map(checkBox => checkBox.value);

    const selectedRolesInput = $('#selectedRoles');
    selectedRolesInput.val(JSON.stringify(selectedRoles));
    form.submit();
  };


  // edit manager
  function editManager(event){
    event.preventDefault();
    const form = event.target;
    console.log(form);

    const roleCheckBoxes = $('input[type="checkbox"]:checked');
    const selectedRoles = Array.from(roleCheckBoxes).map(checkBox => checkBox.value);

    const selectedRolesInput = $('#selectedRoles');
    selectedRolesInput.val(JSON.stringify(selectedRoles));
    form.submit();
  }