import { FC } from "react";
import { SVGProps } from "react";

const SingleCheck: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={7}
    fill="none"
    {...props}
  >
    <path
      fill="#676D6F"
      d="m4.855 5.26-.869-.87-.87-.869L1.81 2.214l-.87.87L4.855 7l6.08-6.08-.87-.87-5.21 5.21Z"
    />
  </svg>
);
export default SingleCheck;
