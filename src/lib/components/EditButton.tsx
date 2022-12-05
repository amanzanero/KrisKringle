import { PencilIcon } from "@heroicons/react/24/solid";
import { classnames } from "../classnames";

type EditButtonProps = {
  onClick?: () => void;
  className?: string;
};

const EditButton: React.FC<EditButtonProps> = (props) => (
  <button
    className={classnames(props.className, "btn-sm btn")}
    onClick={props.onClick}
  >
    <PencilIcon className="h-4 w-4" />
  </button>
);

export default EditButton;
