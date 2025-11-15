"use client";

import { useState } from "react";
import { Check, Edit, Trash2 } from "lucide-react";

const OptionRow = ({
  option,
  onUpdate,
  onDelete,
}: {
  option: QuestionOption;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(option.content);
  const [isCorrect, setIsCorrect] = useState(option.isCorrect);

  const handleSave = () => {
    onUpdate(option.id, { content, isCorrect });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md">
      {isEditing ? (
        <>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 border-b focus:outline-none"
          />
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={isCorrect}
              onChange={(e) => setIsCorrect(e.target.checked)}
            />{" "}
            Đúng
          </label>
          <button onClick={handleSave} className="p-1 text-green-600 cursor-pointer">
            <Check size={18} />
          </button>
        </>
      ) : (
        <>
          <p
            className={`flex-1 ${
              option.isCorrect ? "font-bold text-green-700" : ""
            }`}
          >
            {option.content}
          </p>
          {option.isCorrect && <Check size={18} className="text-green-600" />}
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 cursor-pointer"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(option.id)}
            className="p-1 text-red-500 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  );
};

export default OptionRow;
