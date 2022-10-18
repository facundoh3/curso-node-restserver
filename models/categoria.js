// Todo esto esta en la base de datos osea en tu solicitud necesitas estos campos para poder publicarlo
//Campos necesarios que necesitas para publicar en la base de datos 


const{Schema,model}=require('mongoose')
const CategoriaSchema=Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique:true 
    },
    estado:{
        type: Boolean,
        default: true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true
    }
})

CategoriaSchema.methods.toJSON = function () {
	const {__v,...data} = this.toObject();  
	return data 
};

module.exports=model('Categoria',CategoriaSchema)