import LoginForm from "../components/LoginForm";
import AuthIllustration from "../components/AuthIllustration";
import { Card } from "@/components/ui/card";

export default function LoginView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary/60 lg:p-8">
      <Card className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-xl lg:grid lg:grid-cols-2 p-0 gap-0 border-border">
        {/* Left Section */}
        <section className="hidden lg:block bg-primary/5 border-r border-border">
          <AuthIllustration />
        </section>

        {/* Right Section */}
        <section className="bg-card flex items-center justify-center p-8 sm:p-12">
          <LoginForm />
        </section>
      </Card>
    </main>
  );
}
