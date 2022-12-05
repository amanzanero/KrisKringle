import { type inferProcedureOutput } from "@trpc/server";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NavLayout from "../../../lib/layouts/NavLayout";
import { type AppRouter } from "../../../server/trpc/router/_app";
import { trpc } from "../../../utils/trpc";
import { z } from "zod";

const Wishlist: NextPage = () => {
  const { data: session } = useSession({ required: true });
  const { isReady, query, push } = useRouter();
  const { wishlistSlug } = query;
  const { isLoading: isWishlistLoading, data } =
    trpc.wishlist.getBySlug.useQuery(
      { slug: isReady ? (wishlistSlug as string) : "" },
      {
        enabled: isReady && !!session,
        onError: (err) => {
          if (err.data?.code === "NOT_FOUND") {
            push("/404");
          }
        },
      },
    );

  const isOwner = data?.userId === session?.user?.id;

  const utils = trpc.useContext();
  const { isLoading, mutate } = trpc.wishlist.createEntry.useMutation({
    onSuccess: () => {
      if (!!data) {
        utils.wishlist.getBySlug.invalidate({ slug: data.slug });
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof createEntryInput>>({
    resolver: zodResolver(createEntryInput),
  });

  const onSubmit: SubmitHandler<z.infer<typeof createEntryInput>> = useCallback(
    (input) => {
      const priceUsd = parseFloat(input.priceUsd);
      if (priceUsd === NaN) {
        throw new Error("priceUsd");
      }
      if (!!data) {
        mutate({
          ...input,
          priceUsd,
          wishlistId: data.id,
        });
      }
    },
    [mutate, data],
  );

  const Content = () => {
    if (isWishlistLoading) {
      return (
        <div className="w-full pt-2 sm:pt-10">
          <progress className="progress w-full" />
        </div>
      );
    } else if (!!data && !!session) {
      return (
        <>
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-base-content">
              {isOwner ? "My" : `${data.user.name}'s`} Wishlist
            </h1>
          </div>
          <div className="divider" />
          <form
            className="flex w-full flex-row flex-wrap sm:flex-nowrap sm:items-start"
            onSubmit={(e) => {
              handleSubmit(onSubmit)(e).catch((err) => {
                if (err.message === "priceUsd")
                  setError("priceUsd", { message: "Price must be a number" });
              });
            }}
          >
            <div className="form-control w-full sm:w-fit sm:grow-[10] sm:pr-4">
              <label className="label">
                <span className="label-text">Link (optional)</span>
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="https://linktocoolsite.com"
                className="input-bordered input w-full"
                {...register("link", { required: false })}
              />
              {!!errors.link && (
                <span className="label-text text-red-600">
                  {errors.link.message?.toString()}
                </span>
              )}
            </div>
            <div className="form-control w-full sm:w-fit sm:grow-[10] sm:pr-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="example: Blue socks size 9"
                className="input-bordered input w-full"
                {...register("description")}
              />
              {!!errors.description && (
                <span className="label-text text-red-600">
                  This field is required
                </span>
              )}
            </div>
            <div className="form-control w-full sm:w-fit sm:grow-[0] sm:pr-4">
              <label className="label">
                <span className="label-text">Price ($)</span>
              </label>
              <input
                type="number"
                placeholder="30"
                disabled={isLoading}
                className="input-bordered input w-full"
                {...register("priceUsd")}
              />
              {!!errors.priceUsd && (
                <span className="label-text text-red-600">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex grow flex-col justify-end sm:grow-0">
              <label className="label invisible">
                <span className="label-text">letters</span>
              </label>
              <input
                className="btn w-full sm:w-fit"
                type="submit"
                value="add"
                disabled={isLoading}
              />
            </div>
          </form>
          <Entries entries={data.entries} />
        </>
      );
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
        <title>KrisKringle - Wishlist</title>
      </Head>
      <NavLayout>
        <main className="flex w-full flex-col items-center px-2 sm:px-4">
          <div className="breadcrumbs w-full text-sm sm:max-w-screen-lg ">
            <ul>
              <li>
                <Link href="/home">Home</Link>
              </li>
              <li>
                <Link href={`/secretsanta/${data?.secretSantaGroup?.slug}`}>
                  {data?.secretSantaGroup?.name}
                </Link>
              </li>
              <li>
                {!!data
                  ? data.user.id === session?.user?.id
                    ? "Me"
                    : data.user.name
                  : "Wishlist"}
              </li>
            </ul>
          </div>
          <div className="mt-2 w-full max-w-screen-lg rounded-md sm:mt-5">
            <Content />
          </div>
        </main>
      </NavLayout>
    </>
  );
};

export const createEntryInput = z.object({
  link: z
    .union([z.string().url("Must be a valid URL"), z.string().length(0)])
    .optional(),
  description: z.string().min(1),
  priceUsd: z.string().min(1),
});

const Entries: React.FC<{
  entries: inferProcedureOutput<AppRouter["wishlist"]["getBySlug"]>["entries"];
}> = (props) => {
  return (
    <div>
      <h2 className="mt-4 text-lg font-bold">Entries</h2>
      {props.entries.length === 0 ? (
        <span className="text-lg italic">Nothing on the wishlist yet.</span>
      ) : (
        props.entries.map((ent) => (
          <div key={ent.id}>Woah {ent.description}</div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
