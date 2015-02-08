module.exports = {
  schema: true,

  attributes: {
    type:       "string", //backdrop or poster
    file_path:  {
      type:   "string",
      unique: true
    },
    height:       "integer",
    width:        "integer",
    aspect_ratio: "float",

    // RELATIONS
    movie: {
      model: "movie"
    }
  }
};