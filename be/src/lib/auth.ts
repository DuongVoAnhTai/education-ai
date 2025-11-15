import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken(req: Request) {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  try {
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      console.log("No token found in cookies or headers.");
      return null;
    }

    // const authHeader = req.headers.get("authorization");
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // return null;
    // }
    // const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    return decoded as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}
