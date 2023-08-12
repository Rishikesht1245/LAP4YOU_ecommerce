// validatoion for user Registration

function numberValidator() {
  const inputNumber = $("#inputNumber").val();
  const numberReg = new RegExp("^[0-9]{10}$");
  if (numberReg.test(inputNumber)) {
    $("#submitButton").prop("disabled", false);
    $("#numberInvalid").empty();
  } else {
    $("#submitButton").prop("disabled", true);
    $("#numberInvalid").html(
      '<i class="fa fa-exclamation"></i>Invalid contact Number'
    );
  }
}
function mailValidator() {
  const inputMail = $("#inputMail").val();
  if (
    inputMail.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    $("#submitButton").prop("disabled", false);
    $("#mailInvalid").empty();
  } else {
    $("#submitButton").prop("disabled", true);
    $("#mailInvalid").html('<i class="fa fa-exclamation"></i>Invalid E-mail');
  }
}
function passwordValidator() {
  const inputPassword = $("#inputPassword").val();
  if (inputPassword.length >= 8) {
    if (inputPassword.match(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/)) {
      $("#submitButton").prop("disabled", false);
      $("#passwordInvalid").empty();
    } else {
      $("#submitButton").prop("disabled", true);
      $("#passwordInvalid").html(
        '<i class="fa fa-exclamation"></i>Password must contain atleast a number and an alphabet'
      );
    }
  } else {
    $("#submitButton").prop("disabled", true);
    $("#passwordInvalid").html(
      '<i class="fa fa-exclamation"></i>Password must be atleast 8 characters'
    );
  }
}

// confirm password match
function passwordMatch() {
  const inputPassword = $("#inputPassword").val();
  const confirmPassword = $("#confirmPassword").val();
  if (inputPassword !== confirmPassword) {
    $("#submitButton").prop("disabled", true);
    $("#passwordmatch").html(
      '<i class="fa fa-exclamation"></i>Password doesnot match'
    );
  } else {
    $("#submitButton").prop("disabled", false);
    $("#passwordmatch").empty();
  }
}

// otp expiration counter
window.onload = () => {
  let counter = localStorage.getItem("counter") || 60;
  let countdownInterval;

  function startCounter() {
    countdownInterval = setInterval(updateCounter, 1000);
    $("#resend-button").prop("disabled", true);
  }

  function updateCounter() {
    counter--;
    localStorage.setItem("counter", counter); // Corrected line
    $("#resend-button").text(`OTP Expires in ${counter}s`);
    if (counter <= 0) {
      clearInterval(countdownInterval);
      $("#resend-button").prop("disabled", false);
      $("#resend-button").text("Resend OTP");
      localStorage.removeItem("counter");
    }
  }

  startCounter();
};
