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
        })
    }
  })
}