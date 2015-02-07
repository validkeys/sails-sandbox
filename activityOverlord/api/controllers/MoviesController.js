module.exports = {

  // ?q=MyMovieTitle
  search: function(req, res, next) {
    if (!req.param("q")) return next({err: ["You must provide a search query"]});

    TmdbService.search("movie", req.param("q")).then(function(data) {
      console.log("PROMISE RESOLVED! " + data.results.length + " Results!");
      res.json(data.results);
    });
  }

}