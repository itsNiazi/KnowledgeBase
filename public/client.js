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

// theme-toggler
const links = document.querySelectorAll("a");
const svgs = document.querySelectorAll("svg");
 
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}
 
function getCookie(name) {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}
 
const colorButtons = document.querySelectorAll(".color-button");
const body = document.body;
 
colorButtons.forEach(function (button, index) {
  button.style.backgroundColor = `var(--color-${index + 1})`;
  button.addEventListener("click", function () {
    const color = getComputedStyle(button).getPropertyValue("background-color");
    const textColor = getComputedStyle(button).getPropertyValue("color");
    body.style.transition = "background-color 0.5s ease-in-out";
    body.style.backgroundColor = color;
    body.style.color = textColor;
    links.forEach(function (link) {
      link.style.color = textColor;
    });
    svgs.forEach(function (svg) {
      svg.style.fill = textColor;
    });
    setCookie("theme-color", color, 30); // Save color preference for 30 days
    setCookie("text-color", textColor, 30); // Save text color preference for 30 days
    colorButtons.forEach(function (button) {
      if (
        getComputedStyle(button).getPropertyValue("background-color") === color
      ) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  });
});
 
const themeColor = getCookie("theme-color");
const textColor = getCookie("text-color");
 
if (themeColor && textColor) {
  body.style.backgroundColor = themeColor;
  body.style.color = textColor;
  links.forEach(function (link) {
    link.style.color = textColor;
  });
  svgs.forEach(function (svg) {
    svg.style.fill = textColor;
  });
  colorButtons.forEach(function (button) {
    if (
      getComputedStyle(button).getPropertyValue("background-color") ===
      themeColor
    ) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}



// Fetch notes from the server and initialize Fuse object
fetch("/users/dashboard/notes/search")
  .then((response) => response.json())
  .then((notes) => {
    const fuse = new Fuse(notes, fuseOptions);

    // Event listener for input change
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value;
      const results = fuse.search(searchTerm);
      renderSearchResults(results);
    });
  });

const fuseOptions = {
  keys: ["title"],
  includeMatches: true,
  threshold: 0.3,
  useExtendedSearch: true,
};

// Function to render search results
function renderSearchResults(results) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  for (let i = 0; i < Math.min(results.length, 5); i++) {
    const result = results[i];
    const note = result.item;
    const title = note.title;
    const noteId = note.id;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `/users/dashboard/notes/${noteId}`;
    a.textContent = title;
    li.appendChild(a);

    searchResults.appendChild(li);
  }
}

//gives a pop-up before you delete a note//
function confirmDelete() {
  return confirm("Are you sure you want to delete this note?");
}

function confirmLogout() {
  return confirm("Are you sure you want to log out?");
}


