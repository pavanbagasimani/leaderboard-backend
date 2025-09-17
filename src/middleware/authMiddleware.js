import jwt from "jsonwebtoken";

/**
 * HTTP middleware
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Socket.IO middleware
 */
export function authenticateSocket(socket, next) {
  try {
    // Priority 1: handshake.auth.token
    let token = socket.handshake.auth?.token;

    // Priority 2: Authorization header
    if (!token && socket.handshake.headers?.authorization) {
      token = socket.handshake.headers.authorization.split(" ")[1];
    }

    // Priority 3: query param
    if (!token && socket.handshake.query?.token) {
      token = socket.handshake.query.token;
    }

    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid or expired token"));
  }
}
