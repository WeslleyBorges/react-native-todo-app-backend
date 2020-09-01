const bcrypt = require("bcrypt");

module.exports = (app) => {
  const obterHash = (password, callback) => {
    bcrypt.genSalt(1, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => callback(hash));
    });
  };

  const save = ({ body }, res) => {
    obterHash(body.password, (hash) => {
      const password = hash;

      app
        .db("user")
        .insert({ ...body, password })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).json(err));
    });
  };

  return { save };
};
