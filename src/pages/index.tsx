import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { useChristmas } from "../lib/hooks/useChristmas";
import NavLayout from "../lib/layouts/NavLayout";

const Index: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  const christmas = useChristmas();

  return (
    <>
      <Head>
        <title>KrisKringle</title>
      </Head>
      <NavLayout>
        <main className="flex w-full flex-col items-center">
          <div className="grid auto-cols-max grid-flow-col gap-5 text-center">
            <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
              <span className="countdown font-mono text-5xl">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <span style={{ "--value": christmas.days }}></span>
              </span>
              days
            </div>
            <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
              <span className="countdown font-mono text-5xl">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <span style={{ "--value": christmas.hours }}></span>
              </span>
              hours
            </div>
            <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
              <span className="countdown font-mono text-5xl">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <span style={{ "--value": christmas.minutes }}></span>
              </span>
              min
            </div>
            <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
              <span className="countdown font-mono text-5xl">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <span style={{ "--value": christmas.seconds }}></span>
              </span>
              sec
            </div>
          </div>
        </main>
      </NavLayout>
    </>
  );
};

export default Index;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">Logged in as {sessionData?.user?.name}</p>
      )}
      {secretMessage && <p className="text-2xl text-blue-500">{secretMessage}</p>}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
