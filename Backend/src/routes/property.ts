import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {addProperty, getProperties, rentProperty, getOwnerProperties, searchProperty, getPropertyById} from "../controllers/propertyController";
import upload from "../middleware/upload";
 
const router = express.Router();
router.post("/add",authMiddleware, upload.array("images",5), addProperty);
router.get("/", getProperties);
router.post("/rent/:id", authMiddleware, rentProperty);
router.get("/owner", authMiddleware, getOwnerProperties);
router.get("/search", searchProperty);
router.get("/:id", getPropertyById);

export default router;
