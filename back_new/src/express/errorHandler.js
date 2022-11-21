function errorHandler(err, req, res) {
  return res.status(500).send({ error: err.message });
}

module.exports = errorHandler;
