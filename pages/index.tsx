import React from "react";

//components
import Intro from "./components/intro/intro";
import TopBar from "./components/topbar/topbar";
import Blog from "./components/blog/blog";
import Copyright from "../src/Copyright";

export default function Index() {
  return (
    <div>
      <TopBar />
      <Intro />
      <Blog />
      <Copyright />
    </div>
  );
}
