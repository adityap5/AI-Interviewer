import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/interview/:path*",
  ],
};
// This middleware protects dashboard and interview routes, redirecting unauthenticated users to /login.
