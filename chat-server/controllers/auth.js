const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const newUser = async (req, res = response) => {
	const { email, password } = req.body;
	try {
		const existEmail = await User.findOne({ email });

		if (existEmail.email) {
			return res.status(400).json({
				ok: false,
				msg: "El email ya existe",
			});
		}

		const user = new User(req.body);
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(user.password, salt);

		await user.save();

		const token = await generateJWT(user.uid);

		return res.status(201).json({
			ok: true,
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Error, comunicarse con el administrador",
		});
	}
};

const login = async (req, res = response) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: "El email no es válido",
			});
		}
		const validatePassowrd = bcrypt.compareSync(password, user.password);

		if (!validatePassowrd) {
			return res.status(400).json({
				ok: false,
				msg: "El password es incorrecto",
			});
		}


		const token = await generateJWT(user._id);

		return res.status(200).json({
			ok: true,
			token,
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Error, comunicarse con el administrador",
		});
	}
};

const renewToken = async (req, res = response) => {
	const uid = req.uid;

	try {
		const user = await User.findById(uid);

		const token = await generateJWT(uid);

		return res.status(200).json({
			ok: true,
			token,
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Error, comunicarse con el administrador",
		});
	}
};

module.exports = {
	newUser,
	login,
	renewToken,
};
