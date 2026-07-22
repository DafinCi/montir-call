import {
  registerMechanic,
  loginMechanic,
} from "@/features/auth/services/auth.action";

export default function TestPage() {
  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-bold">1. Test Auth</h1>

      {/* Form Register */}
      <form
        action={registerMechanic}
        className="flex flex-col gap-2 border p-4 rounded"
      >
        <h2 className="font-semibold">Register</h2>
        <input
          name="name"
          placeholder="Nama Montir"
          defaultValue="Budi Montir"
          className="border p-1"
        />
        <input
          name="phone"
          placeholder="No HP"
          defaultValue="08123456789"
          className="border p-1"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue="budi@montir.com"
          className="border p-1"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          defaultValue="password123"
          className="border p-1"
        />
        <button type="submit" className="bg-green-600 text-white p-1 rounded">
          Register
        </button>
      </form>

      {/* Form Login */}
      <form
        action={loginMechanic}
        className="flex flex-col gap-2 border p-4 rounded"
      >
        <h2 className="font-semibold">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue="budi@montir.com"
          className="border p-1"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          defaultValue="password123"
          className="border p-1"
        />
        <button type="submit" className="bg-blue-600 text-white p-1 rounded">
          Login & Go to Dashboard
        </button>
      </form>
    </div>
  );
}
