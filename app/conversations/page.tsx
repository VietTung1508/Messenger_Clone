"use client";

import clsx from "clsx";
import useConverstation from "../hooks/useConverstation";
import EmptyState from "../components/EmptyState";

const Home = () => {
  const { isOpen } = useConverstation();

  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
