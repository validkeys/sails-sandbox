module.exports = {

  // ?q=MyMovieTitle
  search: function(req, res, next) {
    if (!req.param("q")) return next({err: ["You must provide a search query"]});

    var type = req.param("type") || "movie";

    TmdbService.search(type, req.param("q")).then(function(data) {
      console.log("PROMISE RESOLVED! " + data.results.length + " Results!");
      _.each(data.results, function( result ){ 
        var job = sails.config.jobs.create("TmdbImportWorker", {id: result.id, type: type}).save( function(err) {
          if (!err) {
            console.log( job.id );
          } else {
            console.log(err);
          }
        });
      });
      res.json(data.results);
    });
  },

  index: function (req, res, next) {
    Movie.find().then( function (movies) {
      res.json(movies);
    }).catch(function(err) {
      return next(err);
    });
  },

  show: function (req, res, next) {
    console.log("Show");
    Movie.findOne( req.params["id"] ).then( function(movie) {
      return res.json(movie);
    }).catch( function(err) {
      return next(err);
    })
  },

  update: function(req, res, next) {
    console.log("HERE!");
    res.json({});
  },

  destroy: function(req, res, next) {
    console.log("At destroy!", req.params);

    Movie.findOne(req.params["id"]).then( function (movie) {
      console.log("MOVIE RESULT: ", movie)
      if (movie) {
        return Movie.destroy(req.params["id"]);
      } else {
        return true;
      }
    }).then( function (result) {
      res.json({});
    }).catch( function (err) {
      console.log("Catching the error!", err);
      return next(err);
    });

  }

};