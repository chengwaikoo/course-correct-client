import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faHouse,
  faRotateRight,
  faSpinner,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faMoon, faPaste, faSun } from "@fortawesome/free-regular-svg-icons";
import { cn } from "@/lib/utils";

interface IconMapping {
  [key: string]: IconDefinition;
}

const faIcons: IconMapping = {
  lightTheme: faSun,
  darkTheme: faMoon,

  home: faHouse,
  prevStep: faArrowLeft,
  nextStep: faArrowRight,
  restart: faRotateRight,

  spinner: faSpinner,
  success: faCheck,
  warning: faTriangleExclamation,
  error: faXmark,

  paste: faPaste,
};

interface IconProps {
  type: string;
  className?: string;
  fixedWidth?: boolean;
}

const Icon = ({ type, className, fixedWidth = false }: IconProps) => {
  const newClassName = cn(
    className,
    fixedWidth && "fa-fw",
    type === "spinner" && "animate-spin",
    type === "success" && "text-success",
    type === "warning" && "text-warning",
    type === "error" && "text-destructive",
  );
  const icon = faIcons[type];

  return <FontAwesomeIcon className={newClassName} icon={icon} />;
};

export default Icon;
