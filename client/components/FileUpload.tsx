import React, { useRef } from "react";
import styles from "../styles/Create.module.scss";

interface FileUploadProps {
  setFile: Function;
  accept: string;
  children: any;
}
//Дефолтный input type="file" стилизуется достаточно сложно, поэтому мы его скроем и поставим на него ref, и будем стилизовать уже обвертку div
const FileUpload: React.FC<FileUploadProps> = ({
  setFile,
  accept,
  children,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0]);
  };
  return (
    <div
      className={styles.input_container}
      onClick={() => ref.current!.click()}
    >
      <input
        type="file"
        accept={accept} //ставим ограничение на какой-либо формат
        style={{ display: "none" }}
        ref={ref}
        onChange={onChange}
      />
      {/* Здесь будет кнопка с текстом */}
      {children}
    </div>
  );
};

export default FileUpload;
