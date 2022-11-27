import { KeyIcon } from "@heroicons/react/24/solid";
import { type inferProcedureOutput } from "@trpc/server";
import { type NextPage } from "next";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import EditButton from "../../lib/components/EditButton";
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
        <main className="flex w-full flex-col items-center">
          <div className="mt-2 w-full max-w-screen-lg rounded-md px-2 sm:mt-5 sm:px-4 sm:pt-5">
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
        <EditButton className="ml-2" />
      </div>
      <div>
        Owner:{" "}
        <span className="font-bold">{isOwner ? "You" : data.owner.name}</span>
      </div>
      <div className="divider"></div>
      <h2 className="text-xl text-base-content">Members</h2>
      <div className="mt-3 overflow-x-auto rounded-lg  outline outline-1 outline-gray-300 sm:mt-5">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            {data.memberWishlists.map((wList, index) => (
              <tr className="hover cursor-pointer" key={wList.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center">
                    <span>{wList.user.name}</span>
                    {wList.userId === data.ownerId && (
                      <KeyIcon className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </td>
                <td>{wList.createdAt.toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecretSanta;
