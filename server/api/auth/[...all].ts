import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const response = await auth.handler(toWebRequest(event));
  return sendWebResponse(event, response);
});
