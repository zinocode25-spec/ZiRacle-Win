document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }
});
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}