function next(currentNum) {
    if (!currentNum == 0) {
        var currentDiv = "div" + currentNum;
        var nextNum = currentNum + 1;
        var nextDiv = "div" + nextNum;
        var current = document.getElementById(currentDiv);
        var next = document.getElementById(nextDiv);
        current.classList.remove("active_div");
        next.classList.toggle("active_div");

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}
function temp() {
    console.log("clicked")
}
function back(currentNum) {
    if (!currentNum <= 0) {
        var currentDiv = "div" + currentNum;
        var preNum = currentNum - 1;
        var preDiv = "div" + preNum;

        var current = document.getElementById(currentDiv);
        var previous = document.getElementById(preDiv);

        current.classList.remove("active_div");
        previous.classList.toggle("active_div")
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}


function sell_rent() {
    var sellOrRent = document.getElementById("sellOrRent").value;
    var sell_rent = document.getElementById("sell_rent");
    var sell_rent_label = document.getElementById("sell_rent_label");
    if (sellOrRent == "sell") {
        sell_rent.classList.remove("input_with_label2");
        sell_rent.classList.toggle("input_with_label2");
        sell_rent_label.innerHTML = "Enter The Ammount Of Selling:"
    }
    else if (sellOrRent == "rent") {
        sell_rent.classList.remove("input_with_label2");
        sell_rent.classList.toggle("input_with_label2");
        sell_rent_label.innerHTML = "Enter The Amount Of Rent <span class='small'>(per month)</span>:"
    }
    else {
        sell_rent.classList.remove("input_with_label2");

    }
}

function sameCheckbox(){
    var sameAsCheckbox = document.querySelector("#sameAsCheckbox:checked");
    if(sameAsCheckbox != null){
        var uploaderName = document.getElementById("uploaderName");
        var uploaderContact = document.getElementById("uploaderContact");
        var uploaderEmail = document.getElementById("uploaderEmail");

        var ownerName = document.getElementById("ownerName");
        var ownerContact = document.getElementById("ownerContact");
        var ownerEmail = document.getElementById("ownerEmail");

        ownerName.value = uploaderName.value;
        ownerContact.value = uploaderContact.value;
        ownerEmail.value = uploaderEmail.value;
        console.log("added")
    }
    else{
        var ownerName = document.getElementById("ownerName");
        var ownerContact = document.getElementById("ownerContact");
        var ownerEmail = document.getElementById("ownerEmail");

        ownerName.value = "";
        ownerContact.value = "";
        ownerEmail.value = "";
        console.log("removed")
    }
}


function validate(){
    var ownerName_value = document.getElementById("ownerName").value;
    var ownerContact_value = document.getElementById("ownerContact").value;
    var ownerEmail_value = document.getElementById("ownerEmail").value;
    var add_houseNumber_value = document.getElementById("add_houseNumber").value;
    var add_bldgAreaName_value = document.getElementById("add_bldgAreaName").value;
    var add_areaName_value = document.getElementById("add_areaName").value;
    var add_landmark_value = document.getElementById("add_landmark").value;
    var homeType_value = document.getElementById("homeType").value;
    var parking_value = document.getElementById("parking").value;
    var floor_value = document.getElementById("floor").value;
    var totalFloor_value = document.getElementById("totalFloor").value;
    var carpetArea_value = document.getElementById("carpetArea").value;
    var age_value = document.getElementById("age").value;


    var firstImage_value = document.getElementById("firstImage").value;
    var secondImage_value = document.getElementById("secondImage").value;
    var thirdImage_value = document.getElementById("thirdImage").value;
    var fourthImage_value = document.getElementById("fourthImage").value;


    // var sellOrRent = document.getElementById("sellOrRent");
    var sellOrRent = document.getElementById("ammount");


    var allowedExtensions =  /(\.jpg|\.jpeg|\.png)$/i;
    var phoneno = /^\d{10}$/;


    if(ownerName_value == null || ownerContact_value == null || ownerEmail_value == null || add_houseNumber_value == null || add_bldgAreaName_value == null || add_areaName_value == null || add_landmark_value == null || homeType_value == "null" || parking_value == "null" || floor_value == null || totalFloor_value == null || carpetArea_value == null || age_value == null || firstImage_value == null || secondImage_value == null || thirdImage_value == null || fourthImage_value == null || ownerName_value == "" || ownerContact_value == "" || ownerEmail_value == "" || add_houseNumber_value == "" || add_bldgAreaName_value == "" || add_areaName_value == "" || add_landmark_value == "" || homeType_value == "" || parking_value == "" || floor_value == "" || totalFloor_value == "" || carpetArea_value == "" || age_value == "" || firstImage_value == "" || secondImage_value == "" || thirdImage_value == "" || fourthImage_value == ""  ){
        var errMessage = document.getElementById("message");
        errMessage.innerHTML = '<div class="alert alert-warning" role="alert"> Note: All details are required! Please fill all details. Then you can able to enter ammount of sell/rent.</div>';
        sellOrRent.setAttribute("disabled", true);
    }
    else if (!allowedExtensions.exec(firstImage_value) || !allowedExtensions.exec(secondImage_value) || !allowedExtensions.exec(thirdImage_value) || !allowedExtensions.exec(firstImage_value)) { 
        var errMessage = document.getElementById("message");
        errMessage.innerHTML = '<div class="alert alert-warning" role="alert"> Note: Please upload only jpg, jpeg and png images! Then you can able to enter ammount of sell/rent.</div>';
        sellOrRent.setAttribute("disabled", true);
    }
    else if (!ownerContact_value.match(phoneno)) {
        var errMessage = document.getElementById("message");
        errMessage.innerHTML = `<div class="alert alert-warning" role="alert"> Note: Owner's mobile number not entered properly. Please enter a valid mobile number. Then you can able to enter ammount of sell/rent.</div>`;
        sellOrRent.setAttribute("disabled", true);
    
    }
    else{
        var errMessage = document.getElementById("message");
        errMessage.innerHTML = ``;
        sellOrRent.removeAttribute("disabled");
    }


}


// function validate_last(){
    
//     var sellOrRent_value = document.getElementById("sellOrRent").value;
//     var ammount_value = document.getElementById("ammount").value;

//     console.log (sellOrRent_value + " " + ammount_value)

//     if( sellOrRent_value == null || ammount_value == null || sellOrRent_value == "" || ammount_value == "" ){
        
//         var submit = document.getElementById("submit");
//         submit.setAttribute("disabled");
//         submit.classList.toggle("low_opacity");
//     }
//     else{

//         var submit = document.getElementById("submit");
//         submit.removeAttribute("disabled");
//         submit.classList.remove("low_opacity");
//     }

// }

$("#ammount").keyup(function () {
    if ($(this).val()) {
       $("#submit").removeAttr("disabled");
       $("#submit").removeClass("low_opacity");
    }
    else {
        $("#submit").attr("disabled", true);
        $("#submit").addClass("low_opacity");
    }
 });