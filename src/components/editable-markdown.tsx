import React from "react";
import { Editable } from "@wysimark/react";

interface EditableMarkDownProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any; // required, always passed from parent
}

const EditableMarkDown: React.FC<EditableMarkDownProps> = ({
  value,
  onChange,
  placeholder,
  className,
  editor,
}) => {
  // Clean the value to handle problematic content more gracefully
  const cleanValue = React.useMemo(() => {
    if (!value) return "";

    let cleaned = value;

    // Only remove base64 images that are likely to cause issues
    // Keep regular image references and other content intact
    cleaned = cleaned.replace(
      /!\[.*?\]\(data:image\/[^;]+;base64,[^)]+\)/g,
      ""
    );

    return cleaned;
  }, [value]);

  return (
    <Editable
      editor={editor}
      value={cleanValue}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default EditableMarkDown;
