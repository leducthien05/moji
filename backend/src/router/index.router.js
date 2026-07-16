import routerAuth from "./auth.router.js";
import routerUser from "./user.router.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const indexRouter = (app) => {
    app.use("/api/auth", routerAuth);
    app.use("/api/user", authMiddleware, routerUser);
};

export default indexRouter;

