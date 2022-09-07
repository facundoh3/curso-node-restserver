const express = require('express');
const cors = require('cors');
class Server {
	constructor() {
		this.app = express();

		this.PUERTO = process.env.PORT || 3000;

		this.usuariosPath = '/api/usuarios';
		
		//*Middlewares (funciones que siempre se van a ejecutar cuando levante el server)

		this.middlewares();
		//*rutas de mi app
		
		this.routes();
	}
	middlewares() {
		//*Directorio publico
		this.app.use(express.static('public'));

		//*CORS
		this.app.use(cors());

		//*Parseo y lectura del body
		this.app.use(express.json());
	}
	routes() {
		//*Aca los esto declarando como routers

		this.app.use(this.usuariosPath, require('../routes/usuarios.routes'));
		// this.app.get('/',(res,req)=>{
		//la ruta principal es lo que esta en el index
		//     res.send('hello world')
		// })
	}

	listen() {
		this.app.listen(this.PUERTO, () => {
			console.log(`Estoy escuchando en el puerto ${this.PUERTO}`);
		});
	}
}

module.exports = Server;
