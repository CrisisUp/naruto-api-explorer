// backend/src/routes/characters.js
const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");

router.get("/top-jutsu", characterController.getTopJutsu);
router.get("/", characterController.getAllCharacters);
router.get("/:id", characterController.getCharacterById);
router.get("/search/:name", characterController.searchCharacter);
router.get("/status", characterController.getStatus);

module.exports = router;
