// removing product from wishlist 
function removeFromWishlist(productId){
  Swal.fire({
    text: "Proceed to delete?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
        $.ajax({
          url : '/users/wishlist',
          method : 'delete',
          data : {
            id : productId,
          },
          success : (res) => {
            if(res.data.deleted){
              $("#wishlist").load(location.href + " #wishlist");
            }
          }
        });
    }
  });
}

// adding products to cart from wishlist
function addToCartFromWishlist(productId, productDetails){
  const ramCapacity = $('#ramCapacitySelect').val();
  const ssdPrice = JSON.parse(productDetails).find((item) => item.ramCapacity == ramCapacity);
  const ssdCapacity = ssdPrice.ssdCapacity;
  const price = ssdPrice.price;
  console.log('reached');
  $.ajax({
    url: "/users/cart",
    method: "post",
    data: {
      id: productId,
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
        window.location.href = '/users/cart'
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
        window.location.href = '/users/cart'
      } else {
        window.location.href = "/users/signIn";
      }
    },
  });
}