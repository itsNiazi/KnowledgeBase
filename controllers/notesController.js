function addNote(req, res) {
  res.render("pages/about", { layout: "layouts/index" });
}

function postNote(req, res) {
  res.render("pages/about", { layout: "layouts/index" });
}
module.exports = { addNote, postNote };
