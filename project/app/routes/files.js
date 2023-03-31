const express = require("express");
const controller = require("../controllers/fileController");
const router = express.Router();

let routes = (app) => {
  router.post("/files/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  app.use(router);
};

module.exports = routes;
