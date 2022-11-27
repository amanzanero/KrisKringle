import { type NextPage } from "next";
import NavLayout from "../../lib/layouts/NavLayout";
import { trpc } from "../../utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import Alert from "../../lib/components/Alert";
import { useErrorMessage } from "../../lib/hooks/errormessage";
import { useEffect } from "react";
import { useRouter } from "next/router";

type Inputs = {
  name: string;
  year: number;
};

const CreateSecretSantaGroup: NextPage = () => {
  useSession({ required: true });
  const secretSantaMutation = trpc.secretSantaGroup.create.useMutation();
  const { isLoading, error, data, isSuccess } = secretSantaMutation;
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    secretSantaMutation.mutate({ name: data.name });
  };

  const errorMessage = useErrorMessage(error);

  useEffect(() => {
    if (isSuccess && !!data) {
      push(`/secretsanta/${data.slug}`);
    }
  }, [push, isSuccess, data]);

  return (
    <NavLayout>
      <main className="flex w-full flex-col items-center">
        {isLoading && <progress className="progress w-full" />}
        <div className="mt-2 w-full px-2 sm:mt-5 sm:max-w-screen-sm sm:px-4 sm:pt-5">
          <h1 className="text-xl font-bold">Create a Secret Santa Group</h1>
          <div className="divider"></div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col items-center">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Group name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Martinez Family"
                  className="input-bordered input w-full"
                  {...register("name", { required: true })}
                />
                {!!errors.name && (
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
                  value="create"
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

export default CreateSecretSantaGroup;
