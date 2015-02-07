var $http   = require('restler'),
    Promise = require('bluebird');

module.exports = {

  host:           sails.config.tmdb.host,
  apiKey:         sails.config.tmdb.apiKey,

  searchEndpoint: "/search",

  // search by type (movie / tv ..) -> TMDB API DOCS
  search: function( type, q ) {
    var url = this.host + this.searchEndpoint + "/" + type;
    url += "?api_key=" + this.apiKey;
    url += "&query=" + q;
    return this._fetch(url);
  },

  _fetch: function(url) {
    console.log("TMDBSERVICE :: Querying: " + url);
    var promise = new Promise( function( resolve, reject) {
      $http.get(url).on("complete", function(data, response) {
        console.log("Response Received!");
        resolve(data);
      });
    });
    return promise;
  }

}