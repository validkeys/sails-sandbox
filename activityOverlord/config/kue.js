var kue  = require('kue')
  , jobs = kue.createQueue({
    prefix: "kue",
    redis:  {
      host: "localhost",
      port: 6379
    }
  });

// {message: "asdf"}
jobs.process("TmdbImportWorker", function( job, done ) {
  if (!job.data.id || !job.data.type) return done(new Error("No Type or ID supplied!"));
  console.log("*** Importing movie with TMDB ID ("+job.data.id+")! ****");
  TmdbService.getInfo( job.data.type, job.data.id ).then(function( tmdbResponse ){ 
    console.log("GOT RESULT!");

    // if the movie doesnt exist, create it
    Movie.findOne({ tmdb_id: job.data.id}).then(function(movieRecord) {
      if (movieRecord) return done();

      var attrs = _.pick(tmdbResponse, ['overview', 'backdrop_path', 'poster_path', 'release_date', 'runtime', 'tagline', 'title']);
      attrs["tmdb_id"] = tmdbResponse.id;
      return Movie.create(attrs);

    }).then(function(newMovie) {
      if (newMovie) console.log("New Movie Created!", newMovie);
      return done();
    }).catch(function (err) {
      return done(new Error(err));
    });
  });
});

jobs.process("TmdbImagesImportWorker", function (job, done) {
  if (!job.data.id) return done(new Error("You must specify a movie ID"));

  Movie.findOne(job.data.id).then( function(movie) {
    if (!movie) return done(new Error("Movie found found!"));

    console.log("Import images for movie: " + movie.title);
    movie.fetchTmdbRelated("images").then(function(images) {

      // container for the final images array
      var finalImages = [];

      var parseImages = function(imagesArray, type) {
        if (!imagesArray) return;
        _.each(imagesArray, function(image) {
          var fields = _.pick(image, ['aspect_ratio','file_path','height','width']);
          fields["type"]  = type;
          fields["movie"] = movie.id;
          finalImages.push(fields);
        });
      }
      
      parseImages(images.backdrops, "backdrop");
      parseImages(images.posters,   "poster");

      // console.log(finalImages);

      Image.createEach(finalImages).then(function( results ) {
        console.log( results );
      });

      done();
    }).catch( function(err) {
      return done(new Error(err));
    });
    
  });

});


jobs.on("error", function (e) {
  console.log("WORKER ERROR!", e);
});

jobs.on('job enqueue', function(id,type){
  console.log( 'job %s got queued', id );
});

jobs.on("job failed", function(id, err){
  console.log("Job %s failed: " + err, id);
});

jobs.on('job complete', function(id,result){
  kue.Job.get(id, function(err, job){
    if (err) return;
    job.remove(function(err){
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
  });
});

process.once("SIGTERM", function(sig) {
  jobs.shutdown(function (err) {
    console.log("Kue is shutdown", err || "");
    process.exit(0);
  }, 5000);
}); 

module.exports.jobs = jobs;
// module.export.jobs2 = jobs2 <-- Test that

