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
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default EditableMarkDown;
