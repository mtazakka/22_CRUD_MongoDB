var express = require('express');
var router = express.Router();
const moment = require('moment')

module.exports = function (db) {
  const collection = db.collection('breads');
  router.get('/', async (req, res) => {
    const page = req.query.page || 1
    const previous = (parseInt(page) - 1) == 0 ? 1 : (parseInt(page) - 1)
    const next = parseInt(page) + 1
    const limit = 5
    const offset = parseInt((page - 1) * limit)
    const url = req.url == '/' ? '/?page=1' : req.url
    var sortBy = req.query.sortBy == undefined ? "_id" : req.query.sortBy
    var order = req.query.order == undefined ? 1 : req.query.order

    var paramsSort = `{
      "${sortBy}" : ${order}
    }`
    paramsSort = JSON.parse(paramsSort)

    //searching
    // const params = []

    if (req.query.string && req.query.stringFilters == 'on') {
      var paramsString = {
        string:{'$regex' : req.query.string, '$options' : 'i'}
        
      }
      // params.push(`string : /${req.query.string}/`)
    }
    if (req.query.integer && req.query.integerFilters == 'on') {
      var paramsInteger = {
        integer: {'$regex' : req.query.integer, '$options' : 'i'}
      }
      // params.push(`integer : /${req.query.integer}/`)
    }
    if (req.query.float && req.query.floatFilters == 'on') {
      var paramsFloat = {
        float: {'$regex' : req.query.float, '$options' : 'i'}
      }
      // params.push(`float : /${req.query.float}/`)
    }
    if (req.query.dateFilters == 'on') {
      if (req.query.startDate != '' && req.query.toDate != '') {
        var paramsDate = {
        // date: {$gte: {'$regex': new Date(req.query.startDate), '$options' : 'i'}, $lte:{'$regex': new Date(req.query.toDate), '$options' : 'i'}}
        date: {$gte: new Date(req.query.startDate), $lte: new Date(req.query.toDate)}
        }
        // paramsDate = JSON.parse(paramsDate)
        
      } else if (req.query.startDate) {
        var paramsStartDate = {
          'date' : {$gte: new Date(req.query.startDate)}

          // startDate: `new Date(${req.query.startDate})`
        }
        // params.push(`date: {$gt: ${req.query.startDate}}`)
      } else {
        var paramsToDate = {
          toDate: `new Date ${req.query.toDate}`
        }
        // params.push(`date: {$lt: ${req.query.toDate}}`)
      }
    }
    if (req.query.boolean && req.query.booleanFilters == 'on') {
      var paramsBoolean = {
        boolean: req.query.boolean
      }
      }
      // params.push(`boolean = ${req.query.boolean}`)
    
    // console.log('1')
    // console.log(params.join())

    // console.log(limit)
    // console.log(offset)
    // try {
    //   const findResult = await collection.find({ params }).toArray();
    //   console.log('Found documents =>', findResult);
    //   const total = findResult.rows[0].total
    //   const pages = Math.ceil(total / limit)

    try {
    
      // const finalParams = Object.assign(paramsString, paramsInteger, paramsFloat, paramsDate, paramsStartDate, paramsToDate, paramsBoolean)
      const finalParams = {...paramsString, ...paramsInteger, ...paramsFloat, ...paramsDate, ...paramsStartDate, ...paramsToDate, ...paramsBoolean}
      const findResult = await collection.find(finalParams).toArray()
      // console.log (findResult.length)
      const pages = Math.ceil(findResult.length / limit)
      // console.log('find parameter')
      console.log(finalParams)
      // console.log(paramsSort)
      
      const lastResult = await collection.find(finalParams).skip(offset).limit(limit).sort(paramsSort).toArray()
      
      console.log(sortBy)
      console.log(order)
      console.log('Found documents =>', lastResult);
      res.render('list', { rows: lastResult, data: lastResult, page, pages, previous, next, query: req.query, url, sortBy, order })
    } catch (e) {
      console.log(e)
      console.log("Failed to Read")
    }
    // // } catch (e) {
    // //   console.log(e)
    // //   console.log("Failed to Read")
    // }

  })

  //------------------Add--------------------//
  router.get('/add', function (req, res, next) {
    res.render('form')
  })

  router.post('/add', async function (req, res, next) {

    try {
      // const dated = moment(req.body.date).format('DD MMMM YYYY')
      const insertResult = await collection.insertOne(
        {
          id: req.body.id,
          string: req.body.string,
          integer: req.body.integer,
          float: req.body.float,
          date: new Date(req.body.date),
          boolean: req.body.boolean
        });
      console.log('Inserted documents =>', insertResult);
      res.redirect('/')
    } catch (e) {
      console.log(e)
      console.log("Failed to Add")
    }
  })


  //----------------Delete---------------//

  router.get('/delete/:id', async (req, res) => {

    try {
      const index = req.params.id
      console.log('Ini disini')
      console.log(index)
      const deleteResult = await collection.deleteOne({ id: index });
      console.log('Deleted documents =>', deleteResult)
    } catch (e) {
      console.log(e)
      console.log("Failed to Delete")
    }
    res.redirect('/')
  })


  //----------------Edit---------------//
  router.get('/edit/:id', async (req, res) => {
    try {
      const index = req.params.id
      console.log(index)
      const filteredDocs = await collection.find({ id: index }).toArray();
      console.log(`Found documents filtered by { id: ${index} } =>`, filteredDocs);
      res.render('edit', { item: filteredDocs[0], index })   /* res render = menerima dari file */
    } catch (e) {
      console.log(e)
      console.log("Failed to Edit")
    }
  })

  router.post('/edit/:id', async (req, res) => {
    try {
      const index = req.params.id
      const dated = moment(req.query.date).format('DD MMMM YYYY')
      const updateResult = await collection.updateOne({ id: index }, {
        $set: {
          string: req.body.string,
          integer: req.body.integer,
          float: req.body.float,
          date: new Date(req.body.date),
          boolean: req.body.boolean
        }
      });
      console.log('Updated documents =>', updateResult);
      res.redirect('/')
    } catch (e) {
      console.log(e)
      console.log("Failed to Edit")
    }
  })

  return router;
}


