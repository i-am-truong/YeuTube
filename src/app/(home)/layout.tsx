import { HomeLayOut } from "@/modules/home/ui/layouts/home-layout";
// TODO: Confirm if this import is necessary or not
export const dynamic = "force-dynamic";
interface LayOutProps {
  children: React.ReactNode;
}

const LayOut = ({ children }: LayOutProps) => {
  return <HomeLayOut>{children}</HomeLayOut>;
};

export default LayOut;
