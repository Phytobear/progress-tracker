import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <Link href="/">Go back home</Link>
      <p>Sorry, the profile you are looking for does not exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}
