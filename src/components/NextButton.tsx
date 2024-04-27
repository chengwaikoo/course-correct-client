import Icon from "./Icon";
import { Button } from "./ui/button";

interface NextButtonProps {
  onClick: () => void;
  formIsDirty: boolean;
}

export default function NextButton({ onClick, formIsDirty }: NextButtonProps) {
  return (
    <Button
      size="icon"
      title="Next step"
      type="button"
      onClick={onClick}
      disabled={formIsDirty}
    >
      <Icon type="nextStep" />
    </Button>
  );
}
