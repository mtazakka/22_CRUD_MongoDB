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


    if (req.query.string && req.query.stringFilters == 'on') {
      var paramsString = {
        string:{'$regex' : req.query.string, '$options' : 'i'}
        }
    }
    if (req.query.integer && req.query.integerFilters == 'on') {
      var paramsInteger = {
        integer: {'$regex' : req.query.integer, '$options' : 'i'}
      }
    }
    if (req.query.float && req.query.floatFilters == 'on') {
      var paramsFloat = {
        float: {'$regex' : req.query.float, '$options' : 'i'}
      }
    }
    if (req.query.dateFilters == 'on') {
      if (req.query.startDate != '' && req.query.toDate != '') {
        var paramsDate = {
        date: {$gte: new Date(req.query.startDate), $lte: new Date(req.query.toDate)}
        }
        
      } else if (req.query.startDate) {
        var paramsStartDate = {
          date : {$gte: new Date(req.query.startDate)}
        }
      } else {
        var paramsToDate = {
          date : {$lte: new Date(req.query.toDate)}
        }
      }
    }
    if (req.query.boolean && req.query.booleanFilters == 'on') {
      var paramsBoolean = {
        boolean: req.query.boolean
      }
      }
    try {
      const finalParams = {...paramsString, ...paramsInteger, ...paramsFloat, ...paramsDate, ...paramsStartDate, ...paramsToDate, ...paramsBoolean}
      const findResult = await collection.find(finalParams).toArray()
      const pages = Math.ceil(findResult.length / limit)
      console.log(finalParams)
      
      const lastResult = await collection.find(finalParams).collation({ locale: "en" }).skip(offset).limit(limit).sort(paramsSort).toArray()
      
      console.log('Found documents =>', lastResult);
      res.render('list', { rows: lastResult, data: lastResult, page, pages, previous, next, query: req.query, url, sortBy, order })
      // res.status(200).json({data:lastResult})
    } catch (e) {
      console.log(e)
      console.log("Failed to Read")
      res.json(e)
    }
  })

  //------------------Add--------------------//
  router.get('/add', function (req, res, next) {
    res.render('form')
  })
  router.post('/add', async function (req, res, next) {
    try {
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
      res.status(200).json(insertResult)
      res.redirect('/')
    } catch (e) {
      console.log(e)
      console.log("Failed to Add")
      res.json(e)
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
      res.status(200).json(deleteResult)
    } catch (e) {
      console.log(e)
      console.log("Failed to Delete")
      res.json(e)
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
      res.status(200).json(filteredDocs)
    } catch (e) {
      console.log(e)
      console.log("Failed to Edit")
      res.json(e)
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
      res.status(200).json(updateResult)
    } catch (e) {
      console.log(e)
      console.log("Failed to Edit")
      res.json(e)
    }
  })
///-----------_API
  router.get('/api', async (req, res) => {
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


    if (req.query.string && req.query.stringFilters == 'on') {
      var paramsString = {
        string:{'$regex' : req.query.string, '$options' : 'i'}
        }
    }
    if (req.query.integer && req.query.integerFilters == 'on') {
      var paramsInteger = {
        integer: {'$regex' : req.query.integer, '$options' : 'i'}
      }
    }
    if (req.query.float && req.query.floatFilters == 'on') {
      var paramsFloat = {
        float: {'$regex' : req.query.float, '$options' : 'i'}
      }
    }
    if (req.query.dateFilters == 'on') {
      if (req.query.startDate != '' && req.query.toDate != '') {
        var paramsDate = {
        date: {$gte: new Date(req.query.startDate), $lte: new Date(req.query.toDate)}
        }
        
      } else if (req.query.startDate) {
        var paramsStartDate = {
          date : {$gte: new Date(req.query.startDate)}
        }
      } else {
        var paramsToDate = {
          date : {$lte: new Date(req.query.toDate)}
        }
      }
    }
    if (req.query.boolean && req.query.booleanFilters == 'on') {
      var paramsBoolean = {
        boolean: req.query.boolean
      }
      }
    try {
      const finalParams = {...paramsString, ...paramsInteger, ...paramsFloat, ...paramsDate, ...paramsStartDate, ...paramsToDate, ...paramsBoolean}
      const findResult = await collection.find(finalParams).toArray()
      const pages = Math.ceil(findResult.length / limit)
      console.log(finalParams)
      
      const lastResult = await collection.find(finalParams).collation({ locale: "en" })/*.skip(offset).limit(limit)*/.sort(paramsSort).toArray()
      
      console.log('Found documents =>', lastResult);
      // res.render('list', { rows: lastResult, data: lastResult, page, pages, previous, next, query: req.query, url, sortBy, order })
      res.status(200).json({
        data:lastResult,
        page,
        pages,
        previous,
        next,
        sortBy,
        order
      })
    } catch (e) {
      console.log(e)
      console.log("Failed to Read")
      res.json(e)
    }
  })




  return router;
}


