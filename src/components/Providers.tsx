import { Toast } from "./Toast";

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toast />
    </>
  );
};
