const { Router } = require("express");
const { check } = require("express-validator");
const { newUser, login, renewToken } = require("../controllers/auth");
const { validationParams } = require("../middlewares/validationParams");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.post(
	"/new",
	[
		check("name", "El Nombre es obligatorio").not().isEmpty(),
		check("email", "El email es obligatorio").isEmail(),
		check("password", "El password es obligatorio").not().isEmpty(),
		validationParams,
	],
	newUser
);

router.post(
	"/",
	[
		check("email", "El email es obligatorio").isEmail(),
		check("password", "El password es obligatorio").not().isEmpty(),
		validationParams,
	],
	login
);

router.get("/renew", validateJWT, renewToken);

module.exports = router;
