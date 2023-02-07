const jwt = require("jsonwebtoken");

const generateJWT = (uid) => {
	return new Promise((resolve, reject) => {
		const payload = {
			uid,
		};
		jwt.sign(
			payload,
			process.env.JWT_SECRET_KEY,
			{
				expiresIn: "24h",
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject("no se pudo generar el JWT");
				}

				resolve(token);
			}
		);
	});
};

const validateSocketJWT = (token) => {
	try {
		const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);

		return [true, uid];
	} catch (error) {
		return [false, null];
	}
};

module.exports = {
	generateJWT,
	validateSocketJWT,
};
