import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <SignUp />
    </div>
  );
}
