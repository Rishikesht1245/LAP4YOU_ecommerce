function cancelOrder(orderId){
  $.ajax({
    url : '/users/orders/' + orderId,
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

// Print invoice
function printInvoice(id){
  let printContents = document.getElementById(id).innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();

  document.body.innerHTML = originalContents
}


function handleClickEvent(event) {
  const checkbox = event.target;
  const starLabel = checkbox.parentElement;
  starLabel.classList.toggle('checked');
}



