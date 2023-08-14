//================  Listed check ===============================================
window.onload = () => {
  let productId = window.location.pathname.split("/", 3).splice(2).toString();
  $.ajax({
    url: "/products/" + productId,
    type: "patch",
    data: {
      id: productId,
    },
    success: (res) => {
      if (res.message == "unlisted") {
        $("#buyNow").css("pointer-events", "none");
        $("#buyNow").css("pointer-events", "none");
        Swal.fire("Oops!", "Product currently unavailable.", "error");
      }
    },
  });
};
//an api call to check if product is listed or not and removes click event if unlisted
//===================================================================================

// ======================= BUY NOW ========================================//
function buyNow(productID, productDetails) {
  const ramCapacity = $("#ramCapacitySelect").val();
  let ssdPrice = JSON.parse(productDetails).find(
    (details) => details.ramCapacity == ramCapacity
  );
  const ssdCapacity = ssdPrice.ssdCapacity;
  const price = ssdPrice.price;
  let currentURL = window.location.href;
  $.ajax({
    url: "/users/cart",
    method: "post",
    data: {
      id: productID,
      price: price,
      ramCapacity: ramCapacity,
      ssdCapacity: ssdCapacity,
      url: currentURL,
    },
    success: (res) => {
      console.log(res.success);
      if (res.success) {
        window.location.href = "/users/cart";
      } else {
        window.location.href = "/users/signIn";
      }
    },
  });
}

// ======================= Adding to CART =================================//
function addToCart(productID, productDetails) {
  const ramCapacity = $("#ramCapacitySelect").val();
  let ssdPrice = JSON.parse(productDetails).find(
    (details) => details.ramCapacity == ramCapacity
  );
  const ssdCapacity = ssdPrice.ssdCapacity;
  const price = ssdPrice.price;
  let currentURL = window.location.href;

  $.ajax({
    url: "/users/cart",
    method: "post",
    data: {
      id: productID,
      price: price,
      ramCapacity: ramCapacity,
      ssdCapacity: ssdCapacity,
      url: currentURL,
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
        $("#cart-count").load(location.href + " #cart-count");
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
        $("#cart-count").load(location.href + " #cart-count");
      } else if (res.success === "outOfStock") {
        swal.fire({
          icon: "error",
          title: "Out of Stock",
          text: "This product is currently out of stock.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        window.location.href = "/users/signIn";
      }
    },
  });
}

// ============= Update price according to the selected ram and ssd =================
function updatePrice(ramDetails) {
  const ramSelect = $("#ramCapacitySelect").val();
  console.log(ramSelect); // ram size only
  let priceElement;
  priceElement = JSON.parse(ramDetails).find(
    (ram) => ram.ramCapacity == ramSelect
  ).price;
  const price = $("#price");
  price.text(priceElement);
}

//========================= adding product to wish list ===============================
function addToWishlist(productId) {
  let currentURL = window.location.href;
  $.ajax({
    url: "/users/wishlist",
    method: "patch",
    data: {
      id: productId,
      url: currentURL,
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

        $("#wish-count").load(location.href + " #wish-count");
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
        $("#wishlistHeart").html('<i class="fa fa-heart text-danger">');
      } else {
        window.location.href = "/users/signIn";
      }
    },
  });
}

// ===================== IMAGE ZOOMING ===============================

document.addEventListener("DOMContentLoaded", function () {
  const zoomableImage = document.getElementById("zoomable-image");
  mediumZoom(zoomableImage);
});

//====================== DYNAMIC IMAGE CHANGING =======================
// Add event listeners to the small images
const smallImages = document.querySelectorAll(".small-image");
smallImages.forEach((image) => {
  image.addEventListener("click", () => {
    const mainImage = document.getElementById("zoomable-image");
    const newImageSrc = image.dataset.image; // forEach
    mainImage.src = newImageSrc;
  });
});

// ===================== REVIEWS ======================================
// add review
function reviewAdd(productId) {
  Swal.fire({
    showCloseButton: true,
    showConfirmButton: true,
    html: `<form id="reviewForm">
<div class="mb-3">
  <label for="review" class="form-label">Post a review</label>
  <input name="review" class="form-control" id="review pattern='^[A-Z]{1,30}$" >
</div>
<input type="text" name="product" value="${productId}" hidden>
<div class="mb-3">
  <div class="review-star">
    <input type="checkbox" name="rating" id="st1" value="5" />
    <label for="st1"></label>
    <input type="checkbox" name="rating" id="st2" value="4" />
    <label for="st2"></label>
    <input type="checkbox" name="rating" id="st3" value="3" />
    <label for="st3"></label>
    <input type="checkbox" name="rating" id="st4" value="2" />
    <label for="st4"></label>
    <input type="checkbox" name="rating" id="st5" value="1" />
    <label for="st5"></label>
  </div>
</div>
</form>`,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/users/reviews",
        method: "post",
        data: $("#reviewForm").serialize(),
        success: (res) => {
          $("section").load(location.href + " section");
          $("#addReview").hide();
        },
      });
    }
  });
}

// helpgul review
function helpful(reviewId) {
  $.ajax({
    url: "/users/reviews",
    method: "patch",
    data: {
      id: reviewId,
    },
    success: (res) => {
      console.log(res.message);
      if (res.message === 1) {
        $("#helpful" + reviewId).load(location.href + (" #helpful" + reviewId));
      } else {
        window.location.replace("/users/signIn");
      }
    },
  });
}

// checking add review access
function checkAccess(accessToReview, productId) {
  accessToReview = JSON.parse(accessToReview); // Convert the string back to an object
  console.log(accessToReview);
  if (accessToReview && accessToReview.delivered == true) {
    reviewAdd(productId);
  } else {
    Swal.fire({
      showCloseButton: true,
      showConfirmButton: true,
      html: `<h6>Haven't Purchased this Product?</h6> <br>
            <small>Sorry! You are not allowed to review this product since you haven't bought it on LAP4YOU.</small>`,
    });
  }
}
