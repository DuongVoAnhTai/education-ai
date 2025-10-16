import { NextResponse } from "next/server";

export function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3030");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}
