import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {addProperty, getProperties, rentProperty, getOwnerProperties, searchProperty, getPropertyById, getRentedProperties, deleteProperty, verifyUser, getMe, semanticSearch} from "../controllers/propertyController";
import upload from "../middleware/upload";
 
const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.post("/verify", authMiddleware, upload.single("document"), verifyUser);
router.post("/add", authMiddleware, upload.array("images", 5), addProperty);
router.get("/", getProperties);

// static routes
router.get("/owner", authMiddleware, getOwnerProperties);
router.get("/rented", authMiddleware, getRentedProperties); // Moved Up
router.get("/search", searchProperty);
router.get("/search/semantic", semanticSearch);

// Dynamic routes (params) 
router.post("/rent/:id", authMiddleware, rentProperty);
router.get("/:id", getPropertyById); 
router.delete("/:id", authMiddleware, deleteProperty);

export default router;
