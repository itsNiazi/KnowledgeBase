// Slide & Fade-in effect
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("display");
    } else {
      entry.target.classList.remove("display");
    }
  });
});

const hiddenSections = document.querySelectorAll(".hidden");
hiddenSections.forEach((el) => observer.observe(el));

// theme-toggler//
const colorButtons = document.querySelectorAll(".color-button");
const body = document.body;

colorButtons.forEach(function(button, index) {
  button.style.backgroundColor = `var(--color-${index + 1})`;
  button.addEventListener("click", function() {
    const color = getComputedStyle(button).getPropertyValue("background-color");
    const textColor = getComputedStyle(button).getPropertyValue("color");
    body.style.transition = "background-color 0.5s ease-in-out";
    body.style.backgroundColor = color;
    body.style.color = textColor;
    localStorage.setItem("theme-color", color);
    localStorage.setItem("text-color", textColor);
    colorButtons.forEach(function(button) {
      if (getComputedStyle(button).getPropertyValue("background-color") === color) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  });
});

if (localStorage.getItem("theme-color")) {
  const color = localStorage.getItem("theme-color");
  const textColor = localStorage.getItem("text-color");
  body.style.backgroundColor = color;
  body.style.color = textColor;
  colorButtons.forEach(function(button) {
    if (getComputedStyle(button).getPropertyValue("background-color") === color) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}
