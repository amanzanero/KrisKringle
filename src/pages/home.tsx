import type { NextPage } from "next";
// import { trpc } from "../utils/trpc";
import Head from "next/head";
import React from "react";
import NavLayout from "../lib/layouts/NavLayout";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>KrisKringle - Home</title>
      </Head>
      <NavLayout>
        <main className="flex w-full flex-col items-center">
          <h1 className="border-2 border-red-700">This is the Dashboard</h1>
        </main>
      </NavLayout>
    </>
  );
};

export default Home;
