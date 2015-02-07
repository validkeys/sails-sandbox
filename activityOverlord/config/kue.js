var kue  = require('kue')
  , jobs = kue.createQueue({
    prefix: "kue",
    redis:  {
      host: "localhost",
      port: 6379
    }
  });

// {message: "asdf"}
jobs.process("MyWorker", function( job, done ) {
  if (!job.data.message) return done(new Error("No message supplied!"));
  console.log("*** MY WORKER RUNNING! Message: \""+job.data.message+"\"****");
  done();
});

jobs.process("MyMathWorker", function( job, done) {
  // look for job.data.num
  var num = job.data.num;
  // add 10 to it
  var newNum = parseInt(num) + 10;
  // console.log that out
  console.log("MathWorker :: You gave me " + num + " and I added 10 to it to get: " + newNum);
  // call done
  done();
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

