import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {addProperty, getProperties, rentProperty, getOwnerProperties, searchProperty} from "../controllers/propertyController";
 
const router = express.Router();
router.post("/add",authMiddleware,addProperty);
router.get("/", getProperties);
router.post("/rent/:id", authMiddleware, rentProperty);
router.get("/owner", authMiddleware, getOwnerProperties);
router.get("/search", searchProperty);

export default router;
