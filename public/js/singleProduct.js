
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
function addToCart(productID, productDetails) {
  const ramCapacity = $('#ramCapacitySelect').val();
  let ssdPrice = JSON.parse(productDetails).find((details) => details.ramCapacity == ramCapacity);
  const ssdCapacity = ssdPrice.ssdCapacity;
  const price = ssdPrice.price;
  $.ajax({
    url: "/users/cart",
    method: "post",
    data: {
      id: productID,
      price : price,
      ramCapacity : ramCapacity,
      ssdCapacity : ssdCapacity,
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


// ============= Update price according to the selected ram and ssd =================
function updatePrice(ramDetails) {
  const ramSelect = $('#ramCapacitySelect').val();
  console.log(ramSelect) // ram size only
  let priceElement;
  priceElement = JSON.parse(ramDetails).find((ram) => ram.ramCapacity == ramSelect).price;
  const price = $('#price');
  price.text(priceElement);
}



//========================= adding product to wish list ===============================
function addToWishlist(productId) {
  var currentURL = window.location.href;
  $.ajax({
    url: "/users/wishlist",
    method: "patch",
    data: {
      id: productId,
      url : currentURL,
    },
    success: (res) => {
      if (res.data.message === 0) {
        $("#wishlistHeart").html('<i class="fa fa-heart text-white">');
        Swal.fire({
          toast: true,
          icon: "error",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Removed from wishlist",
        });
      } else if (res.data.message === 1) {
        $("#wishlistHeart").html('<i class="fa fa-heart text-danger">');
        Swal.fire({
          toast: true,
          icon: "success",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Added to wishlist",
        });
      } else {
        window.location.href = "/users/signIn";
      }
    },
  });
}
