import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return <div>Please log in to access settings.</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold font-serif mb-6">Settings</h1>
      <SettingsForm user={{ name: user.name || '', email: user.email || '' }} />
    </div>
  );
}