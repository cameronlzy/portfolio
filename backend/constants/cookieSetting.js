export const COOKIESETTING = {
  httpOnly: true, // not accessible by JS
  secure: process.env.NODE_ENV === "production", // only https in prod
  sameSite: "Strict", // protect against CSRF
  maxAge: process.env.JWT_EXPIRES_IN * 1000,
};
