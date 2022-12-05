import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { trpc } from "../utils/trpc";
import NavLayout from "../lib/layouts/NavLayout";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "../server/trpc/router/_app";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession({ required: true });
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
      <>
        <h1 className="w-full pt-5 text-center text-xl font-bold sm:pt-10">
          You&apos;re not part of any groups yet!
        </h1>
        <div className="flex w-full flex-wrap justify-center space-y-3 pt-3 sm:flex-nowrap sm:space-x-3 sm:space-y-0 sm:pt-5">
          <Link href="/secretsanta/create" className="w-full sm:w-fit">
            <button className="btn-primary btn w-full">
              Start a Secret Santa Group
            </button>
          </Link>
          <Link href="/secretsanta/join" className="w-full sm:w-fit">
            <button className="btn-base btn w-full">
              Join an existing group
            </button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center sm:flex-nowrap sm:justify-between">
        <h1 className="w-full text-xl font-semibold text-base-content sm:w-fit">
          My Secret Santa Groups
        </h1>
        <div className="mt-5 flex w-full space-x-2 sm:mt-0 sm:w-fit">
          <button
            className="btn-primary btn grow"
            onClick={() => router.push("/secretsanta/join")}
          >
            Join
          </button>
          <button
            className="btn grow"
            onClick={() => router.push("/secretsanta/create")}
          >
            Create
          </button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="mt-2 overflow-x-auto rounded-lg outline outline-2 outline-gray-300 dark:outline-gray-700 sm:mt-5">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Group name</th>
              <th>Year</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {data.map((group) => (
              <tr
                key={group.id}
                onClick={() => router.push(`/secretsanta/${group.slug}`)}
                className="hover cursor-pointer"
              >
                <td>{group.name}</td>
                <td>{group.year}</td>
                <td>
                  <div className="flex items-center">
                    <UserIcon className="mr-2 inline-block h-4 w-4" />
                    {group.memberWishlists}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
