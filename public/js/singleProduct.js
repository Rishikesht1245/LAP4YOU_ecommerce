
//================  Listed check ===============================================
window.onload=() =>{
  let productId = window.location.pathname.split('/',3).splice(2).toString();
  $.ajax({
    url : '/products/' +productId,
    type : 'patch',
    data : {
            id :productId,
       },
    success : (res) => {
      if(res.message == 'unlisted'){
        $('#buyNow').css('pointer-events', 'none');
        $('#buyNow').css('pointer-events', 'none');
        Swal.fire("Oops!", "Product currently unavailable.", "error");
      }
    }
  })
}
//an api call to check if product is listed or not and removes click event if unlisted
//===================================================================================


// ======================= Adding to CART =================================//
function addToCart(productID) {
  $.ajax({
    url: "/users/cart",
    method: "post",
    data: {
      id: productID,
    },
    success: (res) => {
      if (res.success === "countAdded") {
        Swal.fire({
          toast: true,
          icon: "success",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Count added in cart",
        });
      } else if (res.success === "addedToCart") {
        Swal.fire({
          toast: true,
          icon: "success",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Added to cart",
        });
      } else {
        window.location.href = "/users/signIn";
      }
    },
  });
}