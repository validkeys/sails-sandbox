/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  var movies = [
    { title: "Rush Hour" },
    { title: "Interstellar" }
  ];

  var actors = [
    { name: "Chris Tucker" },
    { name: "Jackie Chan" },
    { name: "Matthew Mcoughnehey" },
    { name: "Michael Caine" }
  ];

  function buildActors() {
    console.log("BOOTSTRAP :: Building Actors");
    actors.forEach(function(actor) {
      Actor.findOneByName(actor.name).then(function(foundActor) {
        if (foundActor) return;
        console.log("Creating Actor: " + actor.name);
        return Actor.create(actor);
      }).then(function(newActor) {
        if (newActor) {
          sails.log.info("Actor Created: ", newActor.toJSON());
        }
      }).catch(function(e) {
        sails.log.error(e);
      });
    });
  }

  function buildMovies() {
    console.log("BOOTSTRAP :: Building Movies");
    movies.forEach(function(movie) {
      Movie.findOneByTitle(movie.title).then(function(foundMovie) {
        if (foundMovie) return;
        console.log("Creating Movie: " + movie.title);
        return Movie.create(movie);
      }).then(function(newMovie) {
        if (newMovie) {
          sails.log.info("Actor Created: ", newMovie.toJSON());
        }
      }).catch(function(e) {
        sails.log.error(e);
      });
    });
  }

  // function buildActorMovieRelations() {
  //   console.log(movies);
  //   var Promise = require('q');
  //   var moviePromises = [
  //     Movie.findOneByTitle(movies[0].title),
  //     Movie.findOneByTitle(movies[1].title)
  //   ];

  //   Promise.all(moviePromises)
  //     .spread(function(rushHour, Interstellar) {
  //       console.log("Got rushHour: ", rushHour.toJSON());
  //     });



  // }

  buildActors();
  buildMovies();
  // buildActorMovieRelations();

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
