import LoginView from "@/features/auth/views/LoginView";
import  registerMechanic from "@/features/auth/services/auth.action"

export const metadata = {
  title: "Login | MontirGo",
  description: "Login ke dashboard MontirGo",
};

export default function LoginPage() {
  return <LoginView />;
}