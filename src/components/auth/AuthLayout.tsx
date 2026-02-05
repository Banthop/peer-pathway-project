 import { Link } from "react-router-dom";
 
 interface AuthLayoutProps {
   children: React.ReactNode;
 }
 
 const AuthLayout = ({ children }: AuthLayoutProps) => {
   return (
     <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
       <div className="w-full max-w-md">
         {/* Logo */}
         <Link to="/" className="flex justify-center mb-8">
           <span className="text-2xl text-foreground font-sans">
             <span className="font-light">Early</span>
             <span className="font-bold">Edge</span>
           </span>
         </Link>
         
         {/* Content */}
         {children}
       </div>
     </div>
   );
 };
 
 export default AuthLayout;