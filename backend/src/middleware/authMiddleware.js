import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  const match =
    typeof authorization === "string" &&
    authorization.match(/^Bearer ([^\s]+)$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET);

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      typeof decoded.role !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}
