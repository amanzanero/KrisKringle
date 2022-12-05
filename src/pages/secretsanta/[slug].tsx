import { KeyIcon, ShareIcon } from "@heroicons/react/24/solid";
import { type inferProcedureOutput } from "@trpc/server";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import NavLayout from "../../lib/layouts/NavLayout";
import { type AppRouter } from "../../server/trpc/router/_app";
import { trpc } from "../../utils/trpc";

const SecretSanta: NextPage = () => {
  const { data: session } = useSession({ required: true });
  const { isReady, query, push } = useRouter();
  const { slug } = query;
  const { isLoading, data } = trpc.secretSantaGroup.getBySlug.useQuery(
    { slug: isReady ? (slug as string) : "" },
    {
      enabled: isReady && !!session,
      onError: (err) => {
        if (err.data?.httpStatus === 404) {
          push("/404");
        }
      },
    },
  );

  const Content = () => {
    if (isLoading) {
      return (
        <div className="w-full pt-2 sm:pt-10">
          <progress className="progress w-full" />
        </div>
      );
    } else if (!!data && !!session) {
      return <SecretSantaGroup data={data} session={session} />;
    } else {
      return (
        <h1 className="text-xl font-semibold text-base-content">
          Sorry, an error ocurred on our end :(
        </h1>
      );
    }
  };

  return (
    <>
      <Head>
        <title>KrisKringle - Home</title>
      </Head>
      <NavLayout>
        <main className="flex w-full flex-col items-center px-2 sm:px-4">
          <div className="breadcrumbs w-full text-sm sm:max-w-screen-lg ">
            <ul>
              <li>
                <Link href="/home">Home</Link>
              </li>
              <li>{!!data ? data.name : "Secret Santa Group"}</li>
            </ul>
          </div>
          <div className="mt-2 w-full max-w-screen-lg rounded-md sm:mt-5 sm:pt-5">
            <Content />
          </div>
        </main>
      </NavLayout>
    </>
  );
};

const SecretSantaGroup: React.FC<{
  data: inferProcedureOutput<AppRouter["secretSantaGroup"]["getBySlug"]>;
  session: Session;
}> = ({ data, session }) => {
  const isOwner = data.ownerId === session.user?.id;

  return (
    <div>
      <div className="flex items-center">
        <h1 className="text-xl text-base-content">
          Group Name: <span className="font-semibold">{data.name}</span>
        </h1>
      </div>
      <div>
        Owner:{" "}
        <span className="font-bold">{isOwner ? "You" : data.owner.name}</span>
      </div>
      <div className="divider"></div>
      <div className="flex w-full justify-between">
        <h2 className="text-xl text-base-content">Members</h2>
        <button className="btn-sm btn">
          Invite
          <ShareIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 overflow-x-auto rounded-lg outline outline-2 outline-gray-300 dark:outline-gray-700 sm:mt-5">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.memberWishlists.map((wList, index) => (
              <tr key={wList.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center">
                    <span>{wList.user.name}</span>
                    {wList.userId === data.ownerId && (
                      <KeyIcon className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex w-full justify-end">
                    <Link href={`wishlist/${wList.slug}`}>
                      <button className="btn-sm btn">Wishlist</button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecretSanta;
