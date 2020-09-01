const moment = require("moment");

module.exports = (app) => {
  const getTasks = (req, res) => {
    const date = req.query.date
      ? req.query.date
      : moment().endOf("day").format("YYYY-MM-30 HH:mm:ss");

    app
      .db("task")
      .where({ userId: req.user.id })
      .where("estimateAt", "<=", date)
      .orderBy("estimateAt")
      .then((tasks) => res.json(tasks))
      .catch((err) => {
        res.status(500).json(err);
      });
  };
  // "2020-09-03 02:10:05.127-04"
  const save = (req, res) => {
    if (!req.body.desc.trim()) {
      return res.status(400).send("Descrição é um campo obrigatório");
    }

    req.body.userId = req.user.id;

    app
      .db("task")
      .insert(req.body)
      .then((_) => res.status(204).send())
      .catch((err) => res.status(500).send());
  };

  const remove = (req, res) => {
    app
      .db("task")
      .where({ id: req.params.id, userId: req.user.id })
      .del()
      .then((rowsDeleted) => {
        if (rowsDeleted) res.status(204).send();
        else {
          const msg = `Não foi encontrada task com id ${req.params.id}.`;
          res.status(500).send(msg);
        }
      })
      .catch((err) => res.status(500).json(err));
  };

  const updateTaskDoneAt = (req, res, doneAt) => {
    app
      .db("task")
      .where({ id: req.params.id, userId: req.user.id })
      .update({ doneAt })
      .then((_) => res.status(204).send())
      .catch((err) => res.status(500).send(err));
  };

  const toggleTask = (req, res) => {
    app
      .db("task")
      .where({ id: req.params.id, userId: req.user.id })
      .first()
      .then((task) => {
        if (!task) {
          const msg = `Não foi encontrada task com id ${req.params.id}.`;
          return res.status(500).send(msg);
        } else {
          const doneAt = task.doneAt ? null : new Date();
          updateTaskDoneAt(req, res, doneAt);
        }
      })
      .catch((err) => res.status(500).send());
  };

  return { getTasks, save, remove, toggleTask };
};
