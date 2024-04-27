import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";

interface HomeButtonProps {
  onClick: () => void;
}

export default function HomeButton({ onClick }: HomeButtonProps) {
  return (
    <Button size="icon" title="Home" type="button" onClick={onClick}>
      <Icon type="home" />
    </Button>
  );
}
