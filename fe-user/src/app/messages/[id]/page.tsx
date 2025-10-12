import MessageIdComponent from "@/components/MessageComponent/MessageIdComponent";

async function MessageIdPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <MessageIdComponent id={id} />;
}

export default MessageIdPage;
