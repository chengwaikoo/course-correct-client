import { useFormContext } from "react-hook-form";

import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";

interface PasteButtonProps {
  index: number;
}

export default function PasteButton({ index }: PasteButtonProps) {
  const { setValue } = useFormContext();

  const handlePasteClick = async (index: number) => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(`postings.${index}`, text);
    } catch (error) {
      console.error("Error pasting text:", error);
    }
  };

  return (
    <Button
      size="icon"
      className="absolute right-3.5 top-3.5"
      title="Paste"
      type="button"
      onClick={() => {
        handlePasteClick(index);
      }}
    >
      <Icon type="paste" />
    </Button>
  );
}
