"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// --- Middleware ---
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, database_1.default)();
// Essential for Cross-Origin Cookies
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Nexus Tech API is Online",
        version: "1.0.0",
        uptime: process.uptime()
    });
});
app.use('/api/auth', auth_route_1.default);
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at PORT ${PORT}`);
});
