import { FC } from "react";
import { SVGProps } from "react";

const FilledDoubleCheck: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={8}
    fill="none"
    {...props}
  >
    <path
      fill={"#1B9C32"}
      d="m6.986 5.39.869.87 5.21-5.21.87.87L7.855 8 3.939 4.084l.87-.87L6.117 4.52l.87.87Zm.001-1.74L10.035.603l.868.868-3.048 3.047-.868-.867Zm-1.74 3.48L4.379 8 .462 4.084l.87-.87.87.87H2.2L5.248 7.13Z"
    />
  </svg>
);
export default FilledDoubleCheck;
