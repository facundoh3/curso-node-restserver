const express = require('express');
const cors = require('cors');
const fileUpload=require('express-fileupload')
const { dbConnection } = require('../database/config');
class Server {
	constructor() {
		this.app = express();

		this.PUERTO = process.env.PORT || 3000;
		this.paths={
			auth:'/api/auth',
			usuarios:'/api/usuarios',
			categorias:'/api/categorias',
			productos:'/api/productos',
			buscar:'/api/buscar',
			uploads:'/api/uploads'
		}
		

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
		//Si dice app.use es un middleware 

		this.app.use(express.static('public'));

		//*CORS
		this.app.use(cors());

		//*LECTURA DEL BODY EN FORMATO JSON
		this.app.use(express.json());

		//Manejar la carga de archivos (osea si alguien quiere subir una imagen por aca)

		this.app.use(fileUpload({
			useTempFiles:true,
			tempFileDir:'/tmp/',
			//Esto lo que hace es crear carpetas cuando se envia un archivo,lo podes enviar o crear una carpeta en especifico ejemplo como enviar un txt a una carpeta textos entonces este te la crea
			createParentPath:true 
		}))

	}
	routes() {
		//*LOS DECLARO COMO ROUTERS
		
		this.app.use(this.paths.auth, require('../routes/auth.routes'));
		this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'));
		this.app.use(this.paths.categorias,require('../routes/categorias.routes'))
		this.app.use(this.paths.productos,require('../routes/productos.routes'))
		this.app.use(this.paths.buscar,require('../routes/buscar.routes'))
		this.app.use(this.paths.buscar,require('../routes/uploads.routes'))


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
