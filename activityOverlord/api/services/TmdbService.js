var $http   = require('restler'),
    Promise = require('bluebird');

module.exports = {

  host:           sails.config.tmdb.host,
  apiKey:         sails.config.tmdb.apiKey,

  searchEndpoint: "/search",

  // search by type (movie / tv ..) -> TMDB API DOCS
  search: function( type, q ) {
    var url = this.host + this.searchEndpoint + "/" + type,
    params = [];
    params.push("query=" + q);
    return this._fetch(url, params);
  },

  // gets the movie information
  getInfo: function( type, id ) {
    var url = this.host + "/" + type + "/" + id;
    return this._fetch(url);
  },

  _fetch: function(url, params) {
    // add the apiKey
    if (!params) params = [];
    params.push("api_key=" + this.apiKey);

    url = url + "?" + params.join("&");
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