import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import NavLayout from "../../lib/layouts/NavLayout";
import { useSessionOrRedirect } from "../../utils/auth";
import { trpc } from "../../utils/trpc";

const SecretSanta: NextPage = () => {
  const { data: session } = useSessionOrRedirect();
  const { isReady, query } = useRouter();
  const { slug } = query;
  const { isLoading, data } = trpc.secretSantaGroup.getBySlug.useQuery(
    { slug: isReady ? (slug as string) : "" },
    {
      enabled: isReady && !!session,
      refetchOnWindowFocus: true,
    },
  );

  return (
    <>
      <Head>
        <title>KrisKringle - Home</title>
      </Head>
      <NavLayout>
        <main className="flex w-full flex-col items-center">
          <div className="mt-2 w-full max-w-screen-lg rounded-md px-2 sm:mt-5 sm:px-4 sm:pt-5">
            {isLoading || !data ? (
              <div className="w-full pt-2 sm:pt-10">
                <progress className="progress w-full" />
              </div>
            ) : (
              <h1 className="text-xl font-semibold text-base-content">
                {data.name}
              </h1>
            )}
          </div>
        </main>
      </NavLayout>
    </>
  );
};

export default SecretSanta;
