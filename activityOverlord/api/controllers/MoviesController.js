module.exports = {

  // ?q=MyMovieTitle
  search: function(req, res, next) {
    if (!req.param("q")) return next({err: ["You must provide a search query"]});

    TmdbService.search("movie", req.param("q")).then(function(data) {
      console.log("PROMISE RESOLVED! " + data.results.length + " Results!");
      res.json(data.results);
    });
  },

  worker: function(req, res, next) {
    var job = sails.config.jobs.create("MyWorker",{message: "Hello Kyle"}).save( function (err) {
      if (!err) console.log( job.id );
    });

    // hoped for result: 10 + 10 = 20
    var secondJob = sails.config.jobs.create("MyMathWorker", {num: 10}).save(function (err) {
      if (!err) {
        console.log( job.id );
      } else {
        console.log(err);
      }
    });

    res.ok();
  }

}