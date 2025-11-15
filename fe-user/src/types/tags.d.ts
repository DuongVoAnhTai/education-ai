interface Tag {
  id: string;
  name: string;
}

interface TagOption {
  value: string; // ID của tag
  label: string; // Tên của tag
  __isNew__?: boolean;
};
