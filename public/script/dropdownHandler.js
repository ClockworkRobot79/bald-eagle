// When the user clicks on the button,
// toggle between hiding and showing the dropdown content
function toggleDropdown(divID) {
    document.getElementById(divID).classList.toggle("show");
}

// find all the anchor tags that have content that matches the filter string
function filterFunction(inputID, divID) {
    const input = document.getElementById(inputID);
    const filter = input.value.toUpperCase();
    const div = document.getElementById(divID);
    const a = div.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
