import { type inferAsyncReturnType } from "@trpc/server";
import { type GetServerSideProps } from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import NavLayout from "../lib/layouts/NavLayout";

export default function SignIn({
  providers,
}: {
  providers: inferAsyncReturnType<typeof getProviders>;
}) {
  const { status } = useSession();
  const router = useRouter();
  const { query, push, isReady } = router;
  const { callbackUrl, error } = query;

  useEffect(() => {
    if (status === "authenticated" && isReady) {
      if (!!callbackUrl) {
        push(callbackUrl as string);
      } else {
        push("/home");
      }
    }
  }, [status, isReady, callbackUrl, push]);

  return (
    <NavLayout>
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-screen-md flex-col items-center bg-base-200 px-2 py-10 sm:mt-10 sm:rounded-md">
          {!!providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} className="w-full sm:w-1/2">
                <button
                  className="btn-primary btn mb-2 w-full"
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          {!!error && (
            <div className="mt-2 rounded-md bg-red-700 px-1 py-1 text-center text-white sm:w-1/2">
              {error}
            </div>
          )}
        </div>
      </div>
    </NavLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
