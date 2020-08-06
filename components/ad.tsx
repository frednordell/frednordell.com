import React, { useEffect } from "react";

const Ad = ({ slotId, width, height }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "inline-block",
        width: `${width}px`,
        height: `${height}px`,
      }}
      data-ad-slot={slotId}
    />
  );
};

export default Ad;
