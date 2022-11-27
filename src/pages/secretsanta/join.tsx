import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Alert from "../../lib/components/Alert";
import { useErrorMessage } from "../../lib/hooks/errormessage";
import NavLayout from "../../lib/layouts/NavLayout";
import { trpc } from "../../utils/trpc";

type Inputs = {
  code: string;
};

const JoinSecretSantaGroup: NextPage = () => {
  useSession({ required: true });
  const secretSantaMutation = trpc.secretSantaGroup.join.useMutation();
  const { push } = useRouter();
  const { isLoading, error, isSuccess, data } = secretSantaMutation;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    secretSantaMutation.mutate({
      code: data.code,
    });
  };

  useEffect(() => {
    if (isSuccess && !!data) {
      push(`/secretsanta/${data.slug}`);
    }
  }, [isSuccess, data, push]);

  const errorMessage = useErrorMessage(error, {
    notFoundMessage: "Secret Santa Group does not exist",
  });

  return (
    <NavLayout>
      <main className="flex w-full flex-col items-center">
        {isLoading && <progress className="progress w-full" />}
        <div className="mt-2 w-full px-2 sm:mt-5 sm:max-w-screen-sm sm:px-4 sm:pt-5">
          <h1 className="mx-auto text-xl font-bold">
            Join existing Secret Santa Group
          </h1>
          <div className="divider"></div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col items-center">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Group Code</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456"
                  className="input-bordered input w-full"
                  {...register("code", { required: true })}
                />
                {!!errors.code && (
                  <span className="label-text text-red-600">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex w-full flex-col">
                <input
                  disabled={isLoading}
                  className="btn mt-4 w-full"
                  type="submit"
                  value="join"
                />
                {!!errorMessage && (
                  <div className="w-full py-2">
                    <Alert text={errorMessage} />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </NavLayout>
  );
};

export default JoinSecretSantaGroup;
