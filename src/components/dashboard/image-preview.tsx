import Image from "next/image";

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export const ImagePreview = ({ src }: { src: CustomFile | string }) => {
  if (!src) {
    return (
      <Image
        src="/files/placeholder.jpg"
        width={300}
        height={300}
        className="rounded-lg border-4 border-white"
        alt="Image preview"
      />
    );
  }

  if (typeof src === "string") {
    return (
      <Image
        src={src}
        width={300}
        height={300}
        className="rounded-lg border-4 border-white"
        alt="Image preview"
      />
    );
  }

  const imgUrl = URL.createObjectURL(src);
  return (
    <Image
      src={imgUrl}
      width={300}
      height={300}
      className="rounded-lg border-4 border-white"
      alt="Image preview"
    />
  );
};
