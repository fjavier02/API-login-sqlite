const expresss = require('express');
const database = require('./database/connection');
const router = require('./src/routes/routes');
const bcrypt = require('bcrypt');
const app = expresss();



const saltRounds = 10;
const myPassword = "Store-Book";
const myOtherPassword = "Other-Store-Book";

const llave = "Store-Book Password"

app.use(expresss.json());
app.use(expresss.urlencoded({ extended: true }));
app.use(router);
app.set('llave', llave);
dato = 'Francisco';

let hash = '$2b$10$6giE5XBZpol7mCsREGxbmOoMER3ziv/G1LsBrEp0XxSq4XLEUpgYe';

//Create Table Users in Database sqlite local if not exists
database.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return database.schema.createTable('users', function (table) {
        table.increments('user_id');
        table.string('username', 255).notNullable();
        table.string('email', 100).notNullable();
        table.unique('email');
        table.string('password', 65).notNullable();
        table.timestamps();
    }).then(data =>{
        console.log({message: "Database Store created with success!"})
    }).catch(error =>{
        console.log(error)
    })
  }});


//Home page
app.get('/', (req,res)=>{
    res.send("<h1>Welcome to Login API!</h1>")

});

app.listen(4000,()=> {
    console.log("Working in the port 4000" + " http://localhost:4000/");
});
