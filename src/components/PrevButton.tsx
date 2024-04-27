import Icon from "./Icon";
import { Button } from "./ui/button";

interface PrevButtonProps {
  onClick: () => void;
}

export default function PrevButton({ onClick }: PrevButtonProps) {
  return (
    <Button size="icon" title="Previous step" type="button" onClick={onClick}>
      <Icon type="prevStep" />
    </Button>
  );
}
