import User from "../Models/User.Model.js"


export default async function checkAuth(req, res, next) {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      return res.status(401).json({
        error: "Not logged in"
      });
    }

    const user = await User.findById(sid).lean();

    if (!user) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
}
