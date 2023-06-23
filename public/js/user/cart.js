// removing product from cart
function removeFromCart(productId){
      $.ajax({
            url : '/users/cart',
            method : 'delete',
            data : {
                  id : productId,
            },
            success : (res) => {
                  if (res.success === "removed") {
                       $('#cart').load(location.href + ' #cart');
                        Swal.fire({
                          toast: true,
                          icon: "error",
                          position: "top-right",
                          showConfirmButton: false,
                          timer: 1000,
                          timerProgressBar: true,
                          animation: true,
                          title: "Removed from cart",
                        });
                      }
            },
      });
};

// add count of products in cart
function addCount(cartId, i, ramCapacity, productId){
      $.ajax({
            url : '/users/cart/count',
            type : 'put',
            data : {
                  cartId : cartId, // products._id in cart
                  ramCapacity : ramCapacity,
                  productId : productId, // products._name._id in cart
            },
            success : (res) => {
                  $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
                  $(`#totalItems`).html(res.data.userCart.totalQuantity);
                  $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
            }
      });
};


// reduce count of products in cart 
function reduceCount(cartId, i){
      $.ajax({
            url : '/users/cart/count',
            method : 'delete',
            data : {
                  cartId : cartId,
            },
            success : (res) => {
                  $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
                  $(`#totalItems`).html(res.data.userCart.totalQuantity);
                  $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
            }
      });
}