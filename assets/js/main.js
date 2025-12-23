function toggleMenu() {
  document
    .getElementById('mobileMenu')
    .classList.toggle('show');
}
// ===== Auto Slider =====
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 3000);
