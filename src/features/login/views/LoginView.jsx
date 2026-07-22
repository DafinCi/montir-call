import LoginForm from "../components/LoginForm";
import AuthIllustration from "../components/AuthIllustration";
import PasswordInput from "../components/PasswordInput";

export default function LoginView() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-10 relative overflow-hidden bg-primary dark:bg-dark-primary">
      <div className="m-3rem">
        <AuthIllustration />
        <section className="flex items-center justify-center p-10">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}