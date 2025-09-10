import { prisma } from "@/lib/prisma";

async function UserPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return (
    <div className="text-center mt-50 text-2xl">
      <h1>{user?.email}</h1>
    </div>
  );
}

export default UserPage;
