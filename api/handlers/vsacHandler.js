const vsacClient = require('../vsac/client');

function login(req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  vsacClient.getTicketGrantingTicket(user, pass)
    .then(t => {
      req.session.ticketGrantingTicket = t;
      req.session.timeOfTGT = new Date();
      res.sendStatus(200);
    })
    .catch(error => {
      req.session.ticketGrantingTicket = null;
      req.session.timeOfTGT = null;
      res.sendStatus(error.statusCode);
    });
}

function getVSDetailsByOID(req, res) {
  const ticketGrantingTicket = req.session.ticketGrantingTicket;
  if (ticketGrantingTicket) {
    vsacClient.getServiceTicket(ticketGrantingTicket)
      .then(serviceTicket => {
        return vsacClient.getVSDetailsByOID(req.params.id, serviceTicket);
      })
      .then(details => {
        res.json(details);
      })
      .catch(error => {
        res.sendStatus(error.statusCode);
      });
  } else {
    // No TGT on the session. Must login first.
    res.sendStatus(401);
  }
}

function getTimeOfTGT(req, res) {
  const time = req.session.timeOfTGT;
  if (time) {
    res.json(time);
  } else {
    // No time of TGT on the session. Must login first.
    res.sendStatus(401);
  }
}

module.exports = {
  login,
  getVSDetailsByOID,
  getTimeOfTGT
};
