"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
// Endpoint: POST /api/auth/signup
authRouter.post('/login', auth_controller_1.login);
authRouter.post('/signup', auth_controller_1.signup);
// Endpoint: POST /api/auth/signout
// authRouter.post('/signout', authMiddleware, signout);
exports.default = authRouter;
