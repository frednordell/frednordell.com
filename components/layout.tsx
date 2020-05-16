import TopBar from "../components/topbar";
import Copyright from "../src/Copyright";

export default function Layout({ children }) {
  return (
    <div id="root">
      <main>
        <TopBar />
        {children}
      </main>
      <footer>
        <Copyright />
      </footer>
    </div>
  );
}
