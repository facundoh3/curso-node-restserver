const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (idToken='') => {
	const ticket = await client.verifyIdToken({
		audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		idToken,
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});
	const { name: nombre, picture: img, email: correo } = ticket.getPayload();
	// If request specified a G Suite domain:
	// const domain = payload['hd'];
	return {
		nombre,
		img,
		correo,
	};
};

module.exports = {
	googleVerify,
};

//Peticion POST desde el frontend

// const data = { id_token };
// fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
// })
// .then((resp) => resp.json())
// .then((data) => console.log('mi server', data))
// .catch(console.log);
// }

// console.log(window.location.hostname.includes('localhost'));
// 			var url = window.location.hostname.includes('localhost')
// 				? 'http://localhost:8080/auth/google'
// 				: console.log('hola');
