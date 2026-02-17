import { Logo } from "@/components/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="text-2xl" />
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;