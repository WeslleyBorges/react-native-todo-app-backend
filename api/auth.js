const { authSecret } = require("../.env");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");

module.exports = (app) => {
  const signin = async ({ body }, res) => {
    if (!body.email || !body.password) {
      return res.status(400).send("Dados incompletos");
    }
    const user = await app.db("user").where({ email: body.email }).first();

    if (user) {
      bcrypt.compare(body.password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).send();
        }

        const payload = { id: user.id };

        res.json({
          name: user.name,
          email: user.email,
          token: jwt.encode(payload, authSecret),
        });
      });
    } else {
      res.status(400).send("Usuário não cadastrado");
    }
  };

  return { signin };
};
