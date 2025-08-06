import ratelimit from "../config/upStash.js";

const rateLimiter = async (req, res, next) => {
  try {
    //user id or IP address in PROD
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }
    next();
  } catch (error) {
    console.log("Rate linit error", error);
    next(error);
  }
};

export default rateLimiter;
