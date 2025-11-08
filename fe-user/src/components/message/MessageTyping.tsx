interface MessageTypingProps {
  typingUsers: { username: string }[];
}

function MessageTyping({ typingUsers }: MessageTypingProps) {
  return (
    <>
      {/* Hiển thị ai đó đang gõ phím */}
      <div className="mt-auto flex-shrink-0">
        {typingUsers.length > 0 && (
          <div className="flex items-end">
            <div className="text-sm text-blue-500 italic">
              {typingUsers.map((u) => u.username).join(", ")} đang soạn tin...
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MessageTyping;
