/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  // ensure that only attributes below
  // can be saved to db
  schema: true,

  attributes: {
    firstName: {
      type:     "string",
      required: true
    },
    lastName:  {
      type:     "string",
      required: true
    },
    email:     {
      type: "string",
      email: true,
      required: true,
      unique: true
    },
    encryptedPassword: {
      type: "string"
    },

    // in order to remove fields from all API
    // requests for this model
    toJSON: function() {
      var obj = this.toObject();

      // encrypted passwords should not be sent
      // back to the client
      delete obj.encryptedPassword;
      return obj;
    }
  },

  beforeCreate: function(values, next) {
    if (!values.password || values.password != values.password_confirmation) {
      return next({err: ["Passwords don't match"]});
    }

    require('bcrypt').hash(values.password, 10, function(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });

  }
};

