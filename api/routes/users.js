var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");
// const moment = require("moment");

module.exports = function (db) {
  const collection = db.collection("breads");

  router.get("/", async (req, res) => {
    if (req.query.string) {
      var paramsString = {
        string: { $regex: req.query.string, $options: "i" },
      };
    }
    if (req.query.integer) {
      var paramsInteger = {
        integer: { $regex: req.query.integer, $options: "i" },
      };
    }
    if (req.query.float) {
      var paramsFloat = {
        float: { $regex: req.query.float, $options: "i" },
      };
    }

    if (req.query.startDate && req.query.toDate) {
      var paramsDate = {
        date: {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.toDate),
        },
      };
    } else if (req.query.startDate) {
      var paramsStartDate = {
        date: { $gte: new Date(req.query.startDate) },
      };
    } else if (req.query.toDate) {
      var paramsToDate = {
        date: { $lte: new Date(req.query.toDate) },
      };
    }

    if (req.query.boolean) {
      var paramsBoolean = {
        boolean: req.query.boolean,
      };
    }
    try {
      const finalParams = {
        ...paramsString,
        ...paramsInteger,
        ...paramsFloat,
        ...paramsDate,
        ...paramsStartDate,
        ...paramsToDate,
        ...paramsBoolean,
      };

      const lastResult = await collection
        .find(finalParams)
        .collation({ locale: "en" })
        .toArray();

      res.status(200).json(lastResult);
    } catch (e) {
      console.log(e);
      console.log("Failed to Read");
      res.json(e);
    }
  });

  router.post("/", async function (req, res, next) {
    try {
      const insertResult = await collection.insertOne({
        id: req.body.id,
        string: req.body.string,
        integer: req.body.integer,
        float: req.body.float,
        // date: moment(new Date(req.body.date)).format("DD MMMM YYYY"),
        date: new Date(req.body.date),
        boolean: req.body.boolean,
      });
      res.status(201).json(insertResult);
    } catch (e) {
      res.json(e);
    }
  });

  router.put("/:id", async function (req, res, next) {
    try {
      const updateResult = await collection.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            id: req.body.id,
            string: req.body.string,
            integer: req.body.integer,
            float: req.body.float,
            // date: moment(new Date(req.body.date)).format("DD MMMM YYYY"),
            date: new Date(req.body.date),
            boolean: req.body.boolean,
          },
        }
      );
      res.status(201).json(updateResult);
    } catch (e) {
      res.json(e);
    }
  });

  router.delete("/:id", async function (req, res, next) {
    try {
      const deleteResult = await collection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.status(201).json(deleteResult);
    } catch (e) {
      res.json(e);
    }
  });

  return router;
};
