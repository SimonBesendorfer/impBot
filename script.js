const menuBtn = document.getElementById('burger-btn');
let burgerBtn = document.getElementById('burger');
let menuOpen = false;

function open(){
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
  }

}
menuBtn.addEventListener('click', function() {
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
  }
});