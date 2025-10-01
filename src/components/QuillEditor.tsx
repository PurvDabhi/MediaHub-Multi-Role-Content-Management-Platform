import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, className }) => {
  const quillRef = useRef<ReactQuill>(null);



  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      className={className}
    />
  );
};

export default QuillEditor;