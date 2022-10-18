const{v4:uuidv4}=require('uuid'); //Genera un id unico parece
// uuidv4();//=>'1b9d6cd7-bcf42-43faag-abd8ad7hg
const path=require('path')



const subirArchivo = (files,extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'],carpeta='') => {

    
	return new Promise((resolve, reject) => {
        //De files sacas el token que se llama archivo por el cual vos subis todo
		const { archivo } = files;
		const nombreCortado = archivo.name.split('.');
		const extension = nombreCortado[nombreCortado.length - 1];
		console.log({
			archivo: 'Este es el archivo completo' + archivo,
			nombreCortado: 'Este es el nombre cortado del archivo' + nombreCortado,
			extension: 'Esta es la extension del archivo' + extension,
		});

		//!Validar que extensiones quiero que se bajen
		//esto es una validacion
		if (!extensionesValidas.includes(extension)) {
			//Si no se incluye la extension que mandaron en extensiones validas
			return reject(`La extension : ${extension} no es permitida, las extensiones que estan permitidas son: 
            ${extensionesValidas}`)
		}

		//Aca esta diciendo en donde lo quiero subir supongo que dirname quiere decir la carpeta donde lo queres alojar que seria en la carpeta uploads y voy a sacarle el name al archivo archivo.name
		const nombreTempArchivo = uuidv4() + ' . ' + extension;
		//NombreTempArchivo me da un uuid con la serie de numeros y el 1b9d6cd7-bcf42-43faag-abd8ad7hg.jpg etc
		const uploadPath = path.join(__dirname, '../uploads/', carpeta , nombreTempArchivo);

		//Aca es la funcion de mover osea es el .mv
		//que si hay un error lo toma y si no ahi te lo envia

		archivo.mv(uploadPath, (err) => {
			if (err) {
				reject(err)
			}
			resolve(nombreTempArchivo)
		});
	});
};

module.exports = {
	subirArchivo,
};
