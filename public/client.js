// Light & Dark-mode
let darkMode = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector("#dark-mode-toggle");

const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkMode", null);
};

if (darkMode === "enabled") {
  enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
  console.log("Click!");
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

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

// Red-theme//
let redMode = localStorage.getItem("redMode");
const redModeToggle = document.querySelector("#red-mode-toggle");

const enableRedMode = () => {
  document.body.classList.add("redmode");
  localStorage.setItem("redMode", "enabled");
};

const disableRedMode = () => {
  document.body.classList.remove("redmode");
  localStorage.setItem("redMode", null);
};

if (redMode === "enabled") {
  enableRedMode();
}

redModeToggle.addEventListener("click", () => {
  console.log("Click!");
  redMode = localStorage.getItem("redMode");
  if (redMode !== "enabled") {
    enableRedMode();
  } else {
    disableRedMode();
  }
});

//orange-theme//

let orangeMode = localStorage.getItem("orangeMode");
const orangeModeToggle = document.querySelector("#orange-mode-toggle");

const enableOrangeMode = () => {
  document.body.classList.add("orangemode");
  localStorage.setItem("orangeMode", "enabled");
};

const disableOrangeMode = () => {
  document.body.classList.remove("orangemode");
  localStorage.setItem("orangeMode", null);
};

if (orangeMode === "enabled") {
  enableOrangeMode();
}

orangeModeToggle.addEventListener("click", () => {
  console.log("Click!");
  orangeMode = localStorage.getItem("orangeMode");
  if (orangeMode !== "enabled") {
    enableOrangeMode();
  } else {
    disableOrangeMode();
  }
});

//green-theme//

let greenMode = localStorage.getItem("greenMode");
const greenModeToggle = document.querySelector("#green-mode-toggle");

const enableGreenMode = () => {
  document.body.classList.add("greenmode");
  localStorage.setItem("greenMode", "enabled");
};

const disableGreenMode = () => {
  document.body.classList.remove("greenmode");
  localStorage.setItem("greenMode", null);
};

if (greenMode === "enabled") {
  enableGreenMode();
}

greenModeToggle.addEventListener("click", () => {
  console.log("Click!");
  greenMode = localStorage.getItem("greenMode");
  if (greenMode !== "enabled") {
    enableGreenMode();
  } else {
    disableGreenMode();
  }
});

//blue-theme//
let blueMode = localStorage.getItem("blueMode");
const blueModeToggle = document.querySelector("#blue-mode-toggle");

const enableBlueMode = () => {
  document.body.classList.add("bluemode");
  localStorage.setItem("blueMode", "enabled");
};

const disableBlueMode = () => {
  document.body.classList.remove("bluemode");
  localStorage.setItem("blueMode", null);
};

if (blueMode === "enabled") {
  enableBlueMode();
}

blueModeToggle.addEventListener("click", () => {
  console.log("Click!");
  blueMode = localStorage.getItem("blueMode");
  if (blueMode !== "enabled") {
    enableBlueMode();
  } else {
    disableBlueMode();
  }
});

//purple-theme//
let purpleMode = localStorage.getItem("purpleMode");
const purpleModeToggle = document.querySelector("#purple-mode-toggle");

const enablePurpleMode = () => {
  document.body.classList.add("purplemode");
  localStorage.setItem("purpleMode", "enabled");
};

const disablePurpleMode = () => {
  document.body.classList.remove("purplemode");
  localStorage.setItem("purpleMode", null);
};

if (purpleMode === "enabled") {
  enablePurpleMode();
}

purpleModeToggle.addEventListener("click", () => {
  console.log("Click!");
  purpleMode = localStorage.getItem("purpleMode");
  if (purpleMode !== "enabled") {
    enablePurpleMode();
  } else {
    disablePurpleMode();
  }
});