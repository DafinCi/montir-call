import LoginForm from "./components/LoginForm";
import AuthIllustration from "./components/AuthIllustration";
import { Card } from "@/components/ui";

export default function LoginView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-8 dark:bg-dark-primary">
      <Card
        className="
          flex
          w-full
          max-w-6xl
          flex-col
          overflow-hidden
          rounded-2xl
          shadow-xl
          md:flex-row
          m-0
        "
      >
        {/* Illustration */}
        <div
          className="
            flex
            flex-1
            items-center
            justify-center
            bg-primary/10
            p-6
            sm:p-8
            md:p-10
          "
        >
          <AuthIllustration />
        </div>

        {/* Login Form */}
        <div
          className="
            flex
            flex-1
            items-center
            justify-center
            p-6
            sm:p-8
            md:p-10
          "
        >
          <LoginForm />
        </div>
      </Card>
    </main>
  );
}
