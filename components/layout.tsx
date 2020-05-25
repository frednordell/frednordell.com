//components
import TopBar from "../components/topbar";
import Copyright from "../src/Copyright";
import { Grid } from "@material-ui/core";

export default function Layout({ children }) {
  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      alignItems="stretch"
      id="root"
    >
      <Grid item component="header">
        <TopBar />
      </Grid>
      <Grid item xs component="main">
        {children}
      </Grid>
      <Grid item component="footer">
        <Copyright />
      </Grid>
    </Grid>
  );
}
