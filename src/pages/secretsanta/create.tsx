import { type NextPage } from "next";
import NavLayout from "../../lib/layouts/NavLayout";
// import { trpc } from "../../utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  year: number;
};

const CreateSecretSantaGroup: NextPage = () => {
  // const secretSantaMutation = trpc.secretSantaGroup.create.useMutation();
  // const session = useSessionOrRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <NavLayout>
      <main className="flex w-full flex-col items-center">
        <div className="mt-2 w-full px-2 sm:mt-5 sm:max-w-screen-sm sm:px-4 sm:pt-5">
          <h1 className="text-xl font-bold">Create a Secret Santa Group</h1>
          <form
            className="w-full pt-3 sm:pt-5"
            onSubmit={handleSubmit(onSubmit)}
          >
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
              <div className="flex w-full">
                <input
                  className="btn mt-4 w-full"
                  type="submit"
                  value="create"
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </NavLayout>
  );
};

export default CreateSecretSantaGroup;
