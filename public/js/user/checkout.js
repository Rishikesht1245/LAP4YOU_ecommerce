function checkCoupon() {
  $.ajax({
    url: "/users/cart/checkout",
    method: "put",
    data: {
      couponCode: $("#couponCode").val(),
    },
    success: (res) => {
      $("#couponMessage").html(res.data.couponCheck);
      $("#couponDiscount").html(res.data.discountPrice);
      $("#inputCouponDiscount").val(res.data.discountPrice);
      $("#finalPrice").html(res.data.finalPrice);
      $("#inputFinalPrice").val(res.data.finalPrice);
    },
  });
}
