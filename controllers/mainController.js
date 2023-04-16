function getIndex(req, res) {
  res.render("layouts/index", { layout: "layouts/index" });
}

module.exports = { getIndex };
