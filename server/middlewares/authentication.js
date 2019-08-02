//verificar token
const jwt = require("jsonwebtoken");
let verificaToken = (req, res, next) => {
  let token = req.get("Token"); //obtener headers
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};
let verificaRole = (req, res, next) => {
  let usr = req.usuario;
  if (usr.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      err: "El usuario no es un administrador"
    });
  }
};
module.exports = {
  verificaToken,
  verificaRole
};
