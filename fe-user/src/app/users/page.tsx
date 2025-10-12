import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function UsersPage() {
  const users = await prisma.user.findMany()
  return (
    <div className="text-center mt-50 text-2xl">
      <h1>Users page</h1>

      <h2>All User ({users.length})</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.name}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
