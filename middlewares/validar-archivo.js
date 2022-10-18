const { response, request } = require("express")



const validarArchivoSubir=(req=request,res=response,next)=>{
    //req.files.archivo seria la variable que es como el xtoken ahi le esta preguntando si esta osea lo esta esperando,files es el formato en que se envia en el body el archivo
    //Files supongo que es la parte donde busca los tokens en el body??

	if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
		return res.status(400).json({
			msg: 'No hay archivos para subir en la peticion-validarArchivoSubir',
		});
	}
    next();
}

module.exports={
    validarArchivoSubir
}