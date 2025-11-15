import MessageComponent from "@/components/message/MessageComponent";

async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MessageComponent conversationId={id} />;
}

export default MessagePage;
