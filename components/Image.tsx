import React, { useState, useRef, useEffect } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

type ImageProps = {
  alt: string;
  traceSrc: any;
  webpSrc: any;
  className: string;
};

const Image: React.FunctionComponent<ImageProps> = ({
  alt,
  traceSrc,
  webpSrc,
  className,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [styles, setStyles] = useState({
    styles: {
      trace: {
        visibility: "visible",
        position: "",
        right: "",
        left: "",
        top: "",
        bottom: "",
      },
      webp: {
        visibility: "hidden",
        position: "fixed",
        right: "0",
        left: "0",
        top: "0",
        bottom: "0",
      },
    } as CSSProperties,
  });

  function onLoad() {
    setStyles({
      styles: {
        trace: {
          visibility: "hidden",
          position: "fixed",
          right: "0",
          left: "0",
          top: "0",
          bottom: "0",
        },
        webp: {
          visibility: "visible",
          position: "",
          right: "",
          left: "",
          top: "",
          bottom: "",
        },
      },
    });
  }

  useEffect(() => {
    if (imgRef.current?.complete) {
      onLoad();
    }
  }, []);

  return (
    <div>
      <img
        id={"trace-" + alt}
        style={styles.styles.trace}
        alt={alt}
        className={className}
        src={traceSrc.trace}
      />
      <img
        ref={imgRef}
        style={styles.styles.webp}
        onLoad={onLoad}
        alt={alt}
        className={className}
        src={webpSrc}
      />
    </div>
  );
};
export default Image;
