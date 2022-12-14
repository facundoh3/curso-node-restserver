const mongoose = require('mongoose');

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.mongodb_atlas, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Base de datos online');
	} catch (error) {
		console.log(error);
		throw new Error('Capo por aca esta el error fijate');
	}
};

module.exports = {
	dbConnection,
};
