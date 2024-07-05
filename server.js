require('dotenv').config()
const app= require('./index');

const PORT = process.env.PORT || config.PORT;
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})