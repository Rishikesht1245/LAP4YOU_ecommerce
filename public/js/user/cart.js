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

// checking out of stock while proceeding to checkout
function proceedToCheckout(event, userCart, quantityInStock){
      event.preventDefault();
      const cart = JSON.parse(userCart);
      const stock = JSON.parse(quantityInStock)

      let outOfStock = false;
      cart.products.forEach((product, i) =>  {
            if(product.quantity > stock[i]){
                  outOfStock = true;
            }
      });

      if(outOfStock === true){
            swal.fire({
                  icon: 'error',
                  title: 'Out of Stock',
                  text: 'Quantity in Cart exceeds the available stock quantity',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                });
      } else{
            window.location = '/users/cart/checkout'
      }
}

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
                if(res.data.message === 'countAdded' ){
                      $("#cart").load(location.href + " #cart")
                }else if(res.data.message === 'outOfStock'){
                  swal.fire({
                        icon: 'error',
                        title: 'Out of Stock',
                        text: 'Quantity in Cart exceeds the available stock quantity',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      });
                }
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
                  $(`#cart`).load(location.href + " #cart")
            }
      });
}


