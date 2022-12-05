import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import NavLayout from "../lib/layouts/NavLayout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const NotFound: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Not Found - KrisKringle</title>
      </Head>
      <NavLayout>
        <main className="flex w-full flex-col items-center">
          <div className="mt-2 flex w-full max-w-screen-lg flex-col items-center rounded-md px-2 sm:mt-5 sm:px-4 sm:pt-5">
            <h1 className="text-xl font-bold">
              Sorry, we couldn't find that page.
            </h1>
            {status == "authenticated" && (
              <button className="btn mt-2" onClick={() => router.push("/home")}>
                Take me home
              </button>
            )}
          </div>
        </main>
      </NavLayout>
    </>
  );
};
export default NotFound;
