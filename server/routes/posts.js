import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/** READ */
// Remember, express runs code top to bottom. This means the order of the below lines should not be altered
router.get("/", verifyToken, getFeedPosts); //returns all post from Post document
router.get("/:userId/posts", verifyToken, getUserPosts); //returns user specific posts
//If we reverse the order of the above statements, mongoose will start assumning the userID as null or undefined. Hence, it will return an empty array.

/** UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
