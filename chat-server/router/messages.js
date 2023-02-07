const { Router } = require("express");
const { check } = require("express-validator");
const { validationParams } = require("../middlewares/validationParams");
const { validateJWT } = require("../middlewares/validateJWT");
const { getChatMessage } = require("../controllers/messages");

const router = Router();

router.get(
	"/:to",
	validateJWT,
	getChatMessage
);

module.exports = router;
