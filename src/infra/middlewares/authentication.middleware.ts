import { decodeToken, verifyToken } from "../services";

export function authenticationMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!verifyToken(token)) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }

  const payload = decodeToken(token);
  (req as any).user = payload;
  next();
}
