var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = function(db){
  // const collection = db.collection('users');
router.get('/', function (req, res, next) {
  db.query('db.users.find()', (err, data)=>{
    if(err) return res.send (err)
res.send('list', {data:data.rows})
  })

  // res.send('respond with a resource');
});

 return router;
}