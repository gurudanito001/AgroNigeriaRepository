import app from './App';
import CONFIG from './config/config';
import './config/db';
require('dotenv').config()
const port = process.env.PORT || 5001;
//const PORT = process.env.PORT;

//app.listen((port,) =>{
  /* if (err) {
    return console.log(err);
  } */
  //console.log(`Server is listening on ${port}`);
//});

app.listen(port, ()=>{
  console.log(`Server is running on port: ${port}`);
});
