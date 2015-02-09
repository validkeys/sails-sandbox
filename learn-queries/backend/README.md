# backend

a [Sails](http://sailsjs.org) application

Create a new role:
```
Movie.findOneByTitle("Rush Hour").then(function(rh) {
  return Actor.findOneByName("Chris Tucker", function(err, actor) {
    Role.create({actor: actor.id, movie: rh.id, character: "Main Guy"}).exec(console.log);
  });
});
```