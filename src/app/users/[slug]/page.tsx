import { prisma } from "@/lib/prisma";

async function UserPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await prisma.user.findUnique({
    where: {
      slug: slug,
    },
  });
  return (
    <div className="text-center mt-50 text-2xl">
      <h1>{user?.email}</h1>
    </div>
  );
}

export default UserPage;
