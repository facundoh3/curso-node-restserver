const jwt=require('jsonwebtoken')
//Aca puedo generar los tokens con la info que puse en las variables de entorno mas el id del usuario 
//Que con el sign lo que hace es como que toma la contraseña "madre" y lo firma para que ese id tenga un token 
const generarJWT=(uid='')=>{
    return new promise((resolve,reject)=>{
        
        const payload={uid}

        jwt.sign(payload,process.env.SECRETORPRIVATEKEY,{
            expiresIn:'4h'
        },(err,token)=>{
            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            }else{
                resolve(token)
            }
        })
    })
}
module.exports=generarJWT