import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { trpc } from "../utils/trpc";
import NavLayout from "../lib/layouts/NavLayout";
import { useSessionOrRedirect } from "../utils/auth";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "../server/trpc/router/_app";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: session } = useSessionOrRedirect();
  const { isLoading, data } = trpc.secretSantaGroup.getAll.useQuery(undefined, {
    enabled: session != null,
    refetchOnWindowFocus: true,
  });

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
            <Table isLoading={isLoading} data={data} />
          </div>
        </main>
      </NavLayout>
    </>
  );
};

const Table: React.FC<{
  isLoading: boolean;
  data?: inferProcedureOutput<AppRouter["secretSantaGroup"]["getAll"]>;
}> = ({ isLoading, data }) => {
  const router = useRouter();

  if (isLoading || !data) {
    return (
      <div className="w-full pt-2 sm:pt-10">
        <progress className="progress w-full" />
      </div>
    );
  }

  if (data && data.length === 0) {
    return (
      <div className="flex w-full justify-center pt-10">
        <button className="btn-primary btn">Start a Secret Santa Group</button>
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-x-auto rounded-lg outline outline-1 outline-gray-300 sm:mt-5">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Group name</th>
            <th>Year</th>
            <th>Members</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map((group) => (
            <tr
              key={group.id}
              onClick={() => router.push(`/secretsanta/${group.slug}`)}
              className="hover cursor-pointer"
            >
              <th>1</th>
              <td>{group.name}</td>
              <td>{group.year}</td>
              <td>{group.memberWishlists}</td>
              <td>{group.createdAt.toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
