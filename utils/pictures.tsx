import fs from "fs";

export default function getPicturesWithColValue() {
  const files = fs.readdirSync(`${process.cwd()}/content/gallery`);

  const pictures = files.map((filename) => {
    return {
      src: filename,
      title: "Test Picture",
      author: "Fred Nordell",
      cols: 2,
      rand: Math.random(),
    };
  });
  return JSON.stringify(pictures);
}
