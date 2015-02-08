module.exports = {

  // ember: {
  //   sideload: true
  // }

  // index: function(req, res, next) {

  //   var filterableParams = ['movie','type']
  //     , params = {}
  //     , page   = req.param("page")  || 1
  //     , limit  = req.param("limit") || 1;

  //   _.each(filterableParams, function(param) {
  //     if (req.param(param)) {
  //       if (!params["where"]) params["where"] = {};
  //       params["where"][param] = req.param(param);
  //     }
  //   });

  //   Image
  //     .find(params)
  //     .paginate({page: page, limit: limit})
  //     .then( function(images) {
  //       res.json(images);
  //     }).catch(function(e) {
  //       return next(e);
  //     });

  // }

};