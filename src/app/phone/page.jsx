import { auth0 } from "@/lib/auth0";
import PhoneForm from "@/components/PhoneNumber";

export default async function PhonePage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return <meta httpEquiv="refresh" content="0;url=/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] border-2">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Phone Number</h1>
        <p className="mb-6 font-bold text-center">Welcome, {user.name || user.email}!</p>
        <PhoneForm />
      </div>
    </div>
  );
}
