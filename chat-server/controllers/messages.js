const { response } = require("express");
const Message = require("../models/message");

const getChatMessage = async (req, res = response) => {
	const from = req.uid;
	const to = req.params.to;

	try {
		const last30 = await Message.find({
			$or: [
				{ from, to },
				{ from: to, to: from },
			],
		})
			.sort({ createdAt: "asc" })
			.limit(30);

			return res.status(201).json({
			ok: true,
			last30,
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
	getChatMessage,
};
