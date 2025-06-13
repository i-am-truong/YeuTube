import { StudioLayOut } from "@/modules/studio/ui/layouts/studio-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <StudioLayOut>{children}</StudioLayOut>;
};

export default Layout;
