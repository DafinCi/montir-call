import LoginForm from "../components/LoginForm";
import AuthIllustration from "../components/AuthIllustration";
import { Card } from "@/components/ui";

export default function LoginView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 lg:p-8">
      <Card
        className="
          w-full
          max-w-6xl
          h-[90vh]
          overflow-hidden
          rounded-3xl
          shadow-2xl
          lg:grid
          lg:grid-cols-2
          p-0
          gap-0
        "
      >
        {/* Left */}
        <section className="hidden lg:block h-full">
          <div className="h-full w-full flex">
            <AuthIllustration />
          </div>
        </section>

        {/* Right */}
        <section className="h-full bg-white">
          <div className="h-full w-full flex items-center justify-center p-12">
            <LoginForm />
          </div>
        </section>
      </Card>
    </main>
  );
}