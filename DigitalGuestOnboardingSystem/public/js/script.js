function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

  
function goToHomepage() {
    window.location.href = "/"; // Navigate to the root URL
}

function goToAboutpage() {
    window.location.href = "/about"; // Navigate to the '/about' route
}

function goToLoginpage() {
    window.location.href = "/Login"; // Navigate to the '/login' route
}

function goToContactpage() {
    window.location.href = "/contact"; // Navigate to the '/contact' route
}

function goToSignuppage() {
    window.location.href = "/signup"; 
}

function goToAddHotel() {
    window.location.href = "/hotel/add"; // Navigate to the add hotel page
}

function goTODisplayHotel() {
    window.location.href = "/hotel"; // Navigate to the page that displays registered hotels
}

function goToCheckHotel(){
    window.location.href='/admin/guests';
}

function goToHotelspage(){
    window.location.href = "/hotels";
}

function goToAddHotel() {
    window.location.href = "/hotel/add";
}

function goToAdminLoginpage() {
    window.location.href = "/adminlogin"; 
}
function goToAdminSignuppage() {
    window.location.href = "/adminsignup"; 
}

function goToProfilepage() {
    window.location.href = "/profile"; 
}

function goToBookingpage() {
    window.location.href = "/login"; 
}

function goToDProfile(){
    window.location.href = "/profile1";
}

function openNav() {
    var sideNav = document.getElementById("mySidenav");
    sideNav.style.width = "250px";
    // Add a smooth slide-in animation
    sideNav.style.transition = "width 0.5s";
}

function closeNav() {
    var sideNav = document.getElementById("mySidenav");
    sideNav.style.width = "0";
    // Add a smooth slide-out animation
    sideNav.style.transition = "width 0.5s";
}