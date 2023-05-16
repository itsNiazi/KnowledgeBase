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

colorButtons.forEach(function (button, index) {
  button.style.backgroundColor = `var(--color-${index + 1})`;
  button.addEventListener("click", function () {
    const color = getComputedStyle(button).getPropertyValue("background-color");
    const textColor = getComputedStyle(button).getPropertyValue("color");
    body.style.transition = "background-color 0.5s ease-in-out";
    body.style.backgroundColor = color;
    body.style.color = textColor;
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

// const searchInput = document.getElementById("searchInput");
// const searchResults = document.getElementById("searchResults");

// var fuse; // Stores the fuse object, when the note list has been fetch from the server (undefined until then)

// // When page loads, fetch all note titles from the server(db) and create a fuse object
// fetch(`/search`)
//   .then((response) => response.json())
//   .then((notes) => {
//     fuse = new Fuse(notes, {
//       keys: ["title"],
//       includeMatches: true,
//       treshold: 0.3,
//       useExtendedSearch: true,
//     });
//   });

// searchInput.addEventListener("input", function () {
//   if (fuse !== undefined) {
//     const searchTerm = this.value;

//     searchResults.innerHTML = "";

//     const results = fuse.search(searchTerm);
//     console.log(results);
//     results.forEach((result) => {
//       const note = result.item;
//       const title = note.title;

//       const li = document.createElement("li");
//       li.textContent = title;

//       searchResults.appendChild(li);
//     });
//   }
// });

// Fetch notes from the server and initialize Fuse object
fetch("/search")
  .then((response) => response.json())
  .then((notes) => {
    const fuse = new Fuse(notes, fuseOptions);
    console.log(fuse);

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
