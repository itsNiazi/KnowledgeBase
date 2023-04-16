// Fråga anton varför den kräven body: ?
function getIndex(req, res) {
  res.render("layouts/index", {
    layout: "layouts/index",
    body: "<h1>Welcome to my website!</h1>",
  });
}
function getAbout(req, res) {
  res.render("pages/about", { layout: "layouts/index" });
}

function getContact(req, res) {
  res.render("pages/contact", { layout: "layouts/index" });
}

module.exports = { getIndex, getAbout, getContact };
