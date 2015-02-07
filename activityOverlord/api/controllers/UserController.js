/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function(req, res, next) {
    User.find( function(err, allUsers) {
      if (err) return next(err);
      res.json(allUsers);
    });
  },

  create: function(req, res, next) {
    User.create(req.params.all(), function(err, userRecord) {
      if (err) { 
        console.log("ERROR: ", err); 
        return next(err);
      }
      res.json(userRecord);
    });
  },

  update: function(req, res, next) {
    User.update(req.params["id"], req.params.all(), function(err, user) {
      if (err) return next(err);
      res.json(user);
    });
  },

  show: function(req, res, next) {
    User.findOne(req.params["id"], function(err, user) {
      console.log(user);
      if (err) return next(err);
      if (!user) return res.notFound();
      res.json(user);
    });
  },

  destroy: function(req, res, next) {
    User.findOne(req.params["id"], function(err, user) {
      if (err) return next(err);
      if (!user) return res.notFound();

      User.destroy(req.params["id"], function(err) {
        if (err) return next(err);
        res.json({});
      });
      
    });
  }

};

