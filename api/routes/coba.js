router.get("/", async function (req, res, next) {
  // const page = req.query.page || 1
  // const previous = (parseInt(page) - 1) == 0 ? 1 : (parseInt(page) - 1)
  // const nextPage = parseInt(page) + 1
  // const limit = 5
  // const offset = parseInt((page - 1) * limit)
  // const url = req.url == '/' ? '/?page=1' : req.url
  // var sortBy = req.query.sortBy == undefined ? "_id" : req.query.sortBy
  // var order = req.query.order == undefined ? 1 : req.query.order

  // var paramsSort = `{
  //   "${sortBy}" : ${order}
  // }`
  // paramsSort = JSON.parse(paramsSort)

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
  if (req.query.date) {
    if (req.query.startDate != "" && req.query.toDate != "") {
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
    } else {
      var paramsToDate = {
        date: { $lte: new Date(req.query.toDate) },
      };
    }
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
    // const finalParams = {};
    const findResult = await collection.find(finalParams).toArray();
    // const pages = Math.ceil(findResult.length / limit)
    // const lastResult = await collection.find(finalParams).collation({ locale: "en" }).skip(offset).limit(limit)/*.sort(paramsSort)*/.toArray()
    // console.log('result parameter',lastResult)
    // const testResult = await collection.find({}).toArray()
    res.status(200).json(findResult);
  } catch (e) {
    res.json(e);
  }
});
