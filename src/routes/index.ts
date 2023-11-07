import AuthMiddleWare from "../middleware/auth";
import authRoutes from "./auth";
import fileRoutes from "./file";
import employeeRoutes from "./employee";
import equidRoutes from "./equip";
import monitoryRoutes from "./monitoring";
import trainingRoutes from "./training";
import userRoutes from "./user";

const routes = (app: any) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/v1/file", [AuthMiddleWare.authenticated], fileRoutes);
  app.use("/api/v1/employee", [AuthMiddleWare.authenticated], employeeRoutes);
  app.use("/api/v1/equip", [AuthMiddleWare.authenticated], equidRoutes);
  app.use("/api/v1/monitory", [AuthMiddleWare.authenticated], monitoryRoutes);
  app.use("/api/v1/training", [AuthMiddleWare.authenticated], trainingRoutes);
  app.use("/api/v1/user", [AuthMiddleWare.authenticated], userRoutes);
};

export default routes;
