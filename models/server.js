const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
class Server {
	constructor() {
		this.app = express();

		this.PUERTO = process.env.PORT || 3000;

		this.usuariosPath = '/api/usuarios';

		//*CONECTAR A BASE DE DATOS
		this.conectarDB();

		//* CREACION DE MIDDLEWARES (FUNCIONES QUE SE VAN A EJECUTAR CUANDO SE LEVANTE EL SERVIDOR)
		this.middlewares();

		//*PARA CONFIGURAR LAS RUTAS DE MI APP
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}


	middlewares() {
		//*DIRECTORIO PUBLICO
		this.app.use(express.static('public'));

		//*CORS
		this.app.use(cors());

		//*LECTURA DEL BODY EN FORMATO JSON
		this.app.use(express.json());
	}
	routes() {
		//*LOS DECLARO COMO ROUTERS

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
