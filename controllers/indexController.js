// Fråga anton varför den kräven body: ?
function getIndex(req, res) {
  res.render("layouts/index", {
    layout: "layouts/index",
    body: "",
  });
}
function getAbout(req, res) {
  res.render("pages/about", { layout: "layouts/index" });
}

function getContact(req, res) {
  res.render("pages/contact", { layout: "layouts/index" });
}

module.exports = { getIndex, getAbout, getContact };
