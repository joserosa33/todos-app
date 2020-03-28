const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect(
            'mongodb+srv://admin:admin@cluster0-dlowm.mongodb.net/test?retryWrites=true&w=majority',
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true 
            }
            );
    } catch (error) {
        console.error('Error connection to mongodb');
        console.error(error);
    }
   
}

module.exports = { connect };