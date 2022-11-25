import { type NextPage } from "next";
import NavLayout from "../../lib/layouts/NavLayout";
import { useSessionOrRedirect } from "../../utils/auth";
// import { trpc } from "../../utils/trpc";
// import { useForm } from "react-hook-form";

const CreateSecretSantaGroup: NextPage = () => {
  // const secretSantaMutation = trpc.secretSantaGroup.create.useMutation();
  const session = useSessionOrRedirect();
  return (
    <NavLayout>
      <main className="flex w-full flex-col items-center">
        <div className="mt-2 w-full max-w-screen-md px-2 sm:mt-5 sm:px-4 sm:pt-5">
          <h1 className="text-xl font-bold">Create a Secret Santa Group</h1>
          <form className="w-full pt-3 sm:pt-5">
            <div className="flex w-full flex-row flex-wrap">
              <div className="w-full sm:basis-1/2 sm:pr-2">
                <label className="label">
                  <span className="label-text">Group name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Martinez Family"
                  className="input-bordered input w-full"
                />
              </div>
              <div className="w-full sm:basis-1/2 sm:pl-2">
                <label className="label">
                  <span className="label-text">Year</span>
                </label>
                <input
                  type="number"
                  placeholder="2022"
                  className="input-bordered input w-full"
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
