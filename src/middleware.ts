import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // all routes except Next.js internal and files
    "/(api|trpc)(.*)",
  ],
};
