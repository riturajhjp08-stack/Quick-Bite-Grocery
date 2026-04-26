const { requestHandler } = require('../server.js');

module.exports = async (req, res) => {
  await requestHandler(req, res);
};
