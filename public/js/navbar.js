window.addEventListener("scroll", function () {
  var header = document.getElementById("navbar");
  header.classList.toggle("sticky", window.scrollY > 0);

})
function dropdown() {
  var menuDropdown = document.getElementById("menuDropdown");
  // menuDropdown.classList.remove("menu-dropdown-hidden");
  menuDropdown.classList.toggle("menu-dropdown");

}
function userMenu() {
  var userMenu = document.getElementById("user");
  userMenu.classList.toggle("user_display")
}