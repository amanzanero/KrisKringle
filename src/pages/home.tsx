import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { trpc } from "../utils/trpc";
import NavLayout from "../lib/layouts/NavLayout";
import { useSessionOrRedirect } from "../utils/auth";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>KrisKringle - Home</title>
      </Head>
      <NavLayout>
        <main className="flex w-full flex-col items-center">
          <div className="mt-2 w-full max-w-screen-lg rounded-md px-2 sm:mt-5 sm:px-4 sm:pt-5">
            <h1 className="text-xl font-semibold text-base-content">
              My Secret Santa Groups
            </h1>
            <Table />
          </div>
        </main>
      </NavLayout>
    </>
  );
};

const Table = () => {
  const { data: session } = useSessionOrRedirect();
  const { isLoading, data } = trpc.secretSantaGroup.getAll.useQuery(undefined, {
    enabled: session != null,
    refetchOnWindowFocus: true,
  });

  if (isLoading || !data) {
    return <div>loading</div>;
  }
  return (
    <div className="mt-2 overflow-x-auto sm:mt-5">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover cursor-pointer">
            <th>1</th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          <tr className="hover">
            <th>2</th>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          <tr className="hover">
            <th>3</th>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Home;
