import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/signup",
    "/signin",
    "/api/clerk/webhooks/user-created",
    "/api/clerk/webhooks/user-updated",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
