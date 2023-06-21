function removeFromWishlist(id) {
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
        url: "/users/wishlist/",
        method: "delete",
        data: {
          productID: id,
        },
        success: (res) => {
          if (res.data.deleted) {
            $("#wishlist").load(location.href + " #wishlist");
          }
        },
      });
    }
  });
}
function addToCartFromWishlist(productID) {
  $.ajax({
    url: "/users/cart",
    method: "post",
    data: {
      id: productID,
    },
    success: (res) => {
      if (res.success === "addedToCart" || res.success === "countAdded") {
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
        $("#wishlist").load(location.href + " #wishlist");
      } else {
        window.location.href = "/users/signIn";
      }
    },
  });
}
