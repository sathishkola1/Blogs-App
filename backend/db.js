const mysql = require('mysql');
require('dotenv').config()
const db = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE
})
 
db.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected to database')
})

db.promise = (query, params) => {
   return new Promise((resolve,reject) => {
        db.query(query, params, function (error, results) {
        if (error){
            return reject(error)
        }
        resolve(results)
      })
    })
}

module.exports = {db}