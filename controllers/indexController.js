function getIndex(req, res) {
  res.render("pages/home", { layout: "layouts/index" });
}

function getAbout(req, res) {
  res.render("pages/about", { layout: "layouts/index" });
}

function getContact(req, res) {
  res.render("pages/contact", { layout: "layouts/index" });
}

module.exports = { getIndex, getAbout, getContact };
