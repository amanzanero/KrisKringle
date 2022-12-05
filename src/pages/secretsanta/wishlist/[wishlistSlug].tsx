import { type inferProcedureOutput } from "@trpc/server";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NavLayout from "../../../lib/layouts/NavLayout";
import { type AppRouter } from "../../../server/trpc/router/_app";
import { trpc } from "../../../utils/trpc";
import { classnames } from "../../../lib/classnames";

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
  const { isLoading: isSubmitting, mutate } =
    trpc.wishlist.createEntry.useMutation({
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                step="0.01"
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
                disabled={isSubmitting}
              />
            </div>
          </form>
          <Entries
            entries={data.entries}
            stageForDeletion={(id) => setEntryIdToDelete(id)}
          />
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

  const [entryIdToDelete, setEntryIdToDelete] = useState<string>();
  const deleteMutation = trpc.wishlist.deleteItemFromWishlist.useMutation({
    onSuccess: () => {
      if (!!data) {
        utils.wishlist.getBySlug.invalidate({ slug: data.slug });
      }
      setEntryIdToDelete(undefined);
    },
  });

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
          <div className="mt-2 mb-5 w-full max-w-screen-lg rounded-md sm:mt-5">
            <Content />
          </div>
          <div
            className={classnames(!!entryIdToDelete && "modal-open", "modal")}
            onClick={() => setEntryIdToDelete(undefined)}
          >
            <div className="modal-box">
              <h3 className="text-lg font-bold">
                Are you sure you want to delete?
              </h3>
              <p className="py-4">
                This will permanently remove this item from your wishlist.
              </p>
              <div className="modal-action">
                <button className="btn" disabled={deleteMutation.isLoading}>
                  nevermind
                </button>
                <button
                  className="btn-error btn"
                  disabled={deleteMutation.isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate({ id: entryIdToDelete as string });
                  }}
                >
                  yup
                </button>
              </div>
            </div>
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
  stageForDeletion: (entryId: string) => void;
}> = (props) => {
  return (
    <div>
      <div className="divider" />
      <h2 className="mt-4 mb-4 text-lg font-bold">Entries</h2>
      {props.entries.length === 0 ? (
        <span className="text-lg italic">Nothing on the wishlist yet.</span>
      ) : (
        <div className="flex flex-col space-y-5">
          {props.entries.map((ent) => (
            <div key={ent.id}>
              <div className="card w-full shadow-xl outline outline-1 outline-gray-200 dark:outline-gray-600">
                <div className="card-body">
                  <h2 className="card-title">
                    {ent.description}
                    {<span className="font-normal">(${ent.price})</span>}
                  </h2>
                  <div className="card-actions justify-end">
                    <button
                      className="btn-error btn-square btn-sm btn"
                      onClick={() => props.stageForDeletion(ent.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {ent.link && (
                    <Link
                      className="link-inf link"
                      href={ent.link}
                      target="_blank"
                    >
                      {ent.link}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
