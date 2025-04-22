import { ComponentProps } from "react";

type Props = {
  children: string;
} & ComponentProps<"button">;

export const Button = ({ children, ...rest }: Props) => {
  return (
    <button
      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      {...rest}
    >
      {children}
    </button>
  );
};
