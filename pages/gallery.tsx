import Layout from "../components/layout";
import SEO from "../components/Seo";
import Image from "../components/Image";
import {
  makeStyles,
  createStyles,
  GridList,
  GridListTile,
  Theme,
} from "@material-ui/core";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import getPicturesWithColValue from "../utils/pictures";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
    },
    gridList: {
      width: "80vw",
      height: "auto",
    },
    gridListTile: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    gridListImage: {
      maxWidth: "100%",
      width: "100%",
      //height: "auto",
      //maxHeight: "100%",
    },
  })
);

const Gallery = (props) => {
  const classes = useStyles();
  const getGridListCols = () => {
    if (isWidthUp("xl", props.width)) {
      return 8;
    }

    if (isWidthUp("lg", props.width)) {
      return 6;
    }

    if (isWidthUp("md", props.width)) {
      return 4;
    }

    return 2;
  };
  //console.log(props.pictures);
  const tileData = JSON.parse(props.pictures);
  /* const tileData = Array(20);
  tileData.fill(
    {
      src: "horizontal.jpg",
      title: "Test Picture",
      author: "Fred Nordell",
      cols: 2,
      rand: Math.random,
    },
    0,
    9
  );

  tileData.fill(
    {
      src: "vertical.jpg",
      title: "Test Picture",
      author: "Fred Nordell",
      cols: 1,
      rand: Math.random,
    },
    10,
    20
  );
 */
  return (
    <Layout>
      <SEO title="Gallery"></SEO>
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={getGridListCols()}>
          {tileData.map((tile) => (
            <GridListTile
              className={classes.gridListTile}
              key={tile.title + tile.rand}
              cols={tile.cols || 1}
            >
              <Image
                src={require(`../content/assets/gallery/${tile.src}`)}
                previewSrc={require(`../content/assets/gallery/${tile.src}?lqip`)}
                alt={tile.title}
                className={classes.gridListImage}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    </Layout>
  );
};

export default withWidth()(Gallery);

export async function getStaticProps() {
  const pictures = getPicturesWithColValue();

  return {
    props: {
      pictures,
    },
  };
}
