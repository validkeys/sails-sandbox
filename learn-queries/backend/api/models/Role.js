module.exports = {
  schema: true,

  attributes: {
    actor: {
      model: "actor"
    },
    movie: {
      model: "movie"
    },
    character: "string"
  }
}