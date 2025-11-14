import { Link as LinkIcon, FileText, Youtube, File } from "lucide-react";

export const GetResourceIcon = ({
  type,
}: {
  type: LearningResource["resourceType"];
}) => {
  switch (type) {
    case "LINK":
      return <LinkIcon className="w-5 h-5 text-blue-500" />;
    case "ARTICLE":
      return <FileText className="w-5 h-5 text-green-500" />;
    case "VIDEO":
      return <Youtube className="w-5 h-5 text-red-500" />;
    case "FILE":
      return <File className="w-5 h-5 text-purple-500" />;
    default:
      return <LinkIcon className="w-5 h-5 text-gray-500" />;
  }
};
