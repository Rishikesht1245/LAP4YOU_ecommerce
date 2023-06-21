function cancelOrder(orderId) {
  $.ajax({
    url: "/users/orders/" + orderId,
    method: "patch",
    success: (res) => {
      if (res.success === "cancelled") {
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

function printInvoice(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}
