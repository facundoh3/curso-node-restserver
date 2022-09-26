//UNIFICAR IMPORTACIONES A UN ARCHIVO (OPTIMIZAR)
//Si apunto a la carpeta middlewares sin nada directamente te busca el index(como HTML)
const  validaCampos  = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const  validaRoles  = require('../middlewares/validar-roles');

module.exports={
    ...validaCampos,
    ...validaJWT,
    ...validaRoles
}