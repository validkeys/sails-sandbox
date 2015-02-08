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
  TmdbService.getInfo( job.data.type, job.data.id ).then(function(result){ 
    console.log("GOT RESULT!", result);
    done();
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

