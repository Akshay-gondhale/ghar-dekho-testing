$(document).ready(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAT2i73e371ZTC81l_R_30bddqE2V8y8hU",
    authDomain: "ghardekho-c3029.firebaseapp.com",
    projectId: "ghardekho-c3029",
    storageBucket: "ghardekho-c3029.appspot.com",
    messagingSenderId: "1039504250371",
    appId: "1:1039504250371:web:ffa0d6971b695ad2ada036",
    measurementId: "G-JFYS0Q6002",
  };
  firebase.initializeApp(firebaseConfig);

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: function (response) {
        console.log("rechaptcha resolved");
      },
    }
  );
  onSignInSubmit();
});

function onSignInSubmit() {
  var sendBtn = document.getElementById("send");
  var verifyBtn = document.getElementById("verify");
  var submitBtn = document.getElementById("submit");
  var otpInput = document.getElementById("otp");

  $("#send").on("click", function () {
    var phoneNo = "+91" + $("#num").val();
    console.log(phoneNo);
    var sendBtn = document.getElementById("send");
    sendBtn.value = "Please Wait...";
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNo, appVerifier)
      .then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        coderesult = confirmationResult;
        console.log(coderesult);
        swal(
          "OTP Sent",
          "OTP is sent successfully to your number. Please check your mobile phone.",
          "success"
        );
        otpInput.classList.remove("hidden");
        sendBtn.classList.toggle("hidden");
        verifyBtn.classList.remove("hidden");
        sendBtn.value = "Send OTP";
      })
      .catch(function (error) {
        console.log(error.message);
        swal(
          "Can't Send OTP",
          "OTP cannot be send at this moment please try again after some time. Sorry...!",
          "error"
        );

        sendBtn.value = "Send OTP";
      });
  });
  $("#verify").on("click", function () {
    verifyBtn.value = "Please Wait...";
    let phoneNo = "";
    var code = $("#otp").val();
    console.log(code);
    confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log("Successfull");

        verifyBtn.value = "Verify OTP";
        swal(
          "Verified!",
          "OTP verified successfully! Please click on submit. Thank You..",
          "success"
        );
        otpInput.classList.toggle("hidden");
        verifyBtn.classList.toggle("hidden");
        submitBtn.classList.remove("hidden");
      })
      .catch((error) => {
        console.log("wrong captcha");
        swal("Wrong OTP!", "Entered OTP is wrong please try again!", "error");
        verifyBtn.value = "Verify OTP";
        sendBtn.classList.remove("hidden");
        otpInput.classList.toggle("hidden");
        verifyBtn.classList.toggle("hidden");
      });
  });
}

