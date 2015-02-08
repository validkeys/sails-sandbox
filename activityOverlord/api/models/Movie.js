module.exports = {
  schema: true,

  attributes: {
    tmdb_id:      {
      type:   'integer',
      unique: true
    },
    overview:     'text',
    backdrop_path: 'string',
    poster_path:  'string',
    release_date: 'date',
    runtime:      'integer',
    tagline:      'string',
    title:        'string',

    // RELATIONS
    images: {
      collection: "image",
      via:        "movie"
    },

    // INSTANCE METHODS
    fetchTmdbRelated: function( relatedType ){
      return TmdbService.getRelated("movie", this.tmdb_id, relatedType);
    }
  },

  afterCreate: function (newMovie, cb) {

    // Create a new worker job that will import the images
    sails.config.jobs.create("TmdbImagesImportWorker", {id: newMovie.id}).save();

    cb();
  }
};