function getIndex(req, res) {
  res.render("pages/home", { layout: "layouts/index" });
}

module.exports = { getIndex };
