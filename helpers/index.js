const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');


//Esto es como que contiene todas las funciones y variables etc de los archivos
//por eso los 3 puntos es como un rest operator
module.exports={
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}