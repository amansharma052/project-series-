const mongoose=require('mongoose')

async function connectToDB(){

    try {
         await mongoose.connect(process.env.MONGO_URI)
        console.log("server is successfully connected to DB")
        
    } catch (error) {
        console.log("Server not connected to DB",error)
        
    }

}

module.exports=connectToDB

