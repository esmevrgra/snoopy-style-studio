const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// tell Express where views live
app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "pug");

// serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "Public")));

// home route
app.get("/", (req, res) => {
  res.render("index");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
