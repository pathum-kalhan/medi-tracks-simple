import { Alert } from "@mui/material";
import { FileRejection } from "react-dropzone";

type Props = {
  fileRejections: FileRejection[];
};

export const FileRejections = ({ fileRejections }: Props) => {
  if (!fileRejections.length) {
    return null;
  }

  return (
    <div>
      {fileRejections.map(({ errors }, index) => (
        <div key={index}>
          {errors.map((error, index) => (
            <Alert key={index} severity="error">
              {error.message}
            </Alert>
          ))}
        </div>
      ))}
    </div>
  );
};
