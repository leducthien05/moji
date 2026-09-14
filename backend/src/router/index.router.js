import routerAuth from "./auth.router.js";
import routerUser from "./user.router.js";
import friendRouter from "./friend.router.js";
import messageRouter from "./message.router.js";
import conversationRouter from "./conversation.router.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const indexRouter = (app) => {
    app.use("/api/auth", routerAuth);
    app.use("/api/user", authMiddleware, routerUser);
    app.use("/api/friend", authMiddleware, friendRouter);
    app.use("/api/message", authMiddleware, messageRouter);
    app.use("/api/conversation", authMiddleware, conversationRouter);
};

export default indexRouter;

