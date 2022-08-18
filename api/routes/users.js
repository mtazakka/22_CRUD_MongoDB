var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = function (db) {
  const collection = db.collection('breads');

  router.get('/', async function (req, res, next) {
    try {
      const findResult = await collection.find({}).toArray();
      res.status(200).json(findResult)
    } catch (e) {
      res.json(e)
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const insertResult = await collection.insertOne({ name: req.body.name, address: req.body.address });
      res.status(201).json(insertResult)
    } catch (e) {
      res.json(e)
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const updateResult = await collection.updateOne({ _id: ObjectId(req.params.id) }, { $set: 
        {
          id: req.body.id,
          string: req.body.string,
          integer: req.body.integer,
          float: req.body.float,
          date: new Date(req.body.date),
          boolean: req.body.boolean
        }
      });
      res.status(201).json(updateResult)
    } catch (e) {
      res.json(e)
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const deleteResult = await collection.deleteOne({ _id: ObjectId(req.params.id) });
      res.status(201).json(deleteResult)
    } catch (e) {
      res.json(e)
    }
  });

  return router;
}
