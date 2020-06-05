import React from "react";

type ImageProps = {
  alt: string;
  path: string;
  className: string;
};
const Image: React.FunctionComponent<ImageProps> = ({
  alt,
  path,
  className,
}) => {
  return (
    <div className="image-container">
      <img
        alt={alt}
        className={className}
        src={require(`${path}?trace`).trace}
      />
      <img alt={alt} className={className} src={require(`${path}?webp`)} />
      <style jsx>{`
        .image-container: {
          position: relative:
        }
        img {
          position: absolute;
          top: 0;
          left: 0;
        }
    `}</style>
    </div>
  );
};
export default Image;
/* 
export default function Image({ alt, src, className }) {
  return (
    <img
      className={`${className}`}
      alt={alt}
      src={require(src).trace}
      data-srcset={src}
    />
  );
}
 */
