import jwt from "jsonwebtoken";

export function verifyToken(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    return decoded as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}