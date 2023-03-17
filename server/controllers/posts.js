import Post from "../models/Post.js"
import User from "../models/User.js"

//CREATE POST
//Named vs Default exports
//1. Export multiple values (like functions as in this module) & import name should be the same as defined here
//2. Default can only exprt single value (like in model subsection) & import name can be defined by the user
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findById(userId)

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    })
    //saving it to mongoDB
    await newPost.save()
    //grbbing the post from teh DB to return it to teh frontend
    const post = await Post.find()
    res.status(201).json(post)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

// READ POST
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find()
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

//Get user Posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const post = await Post.find({ userId })
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const likePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const post = Post.findById(id) //later try with {id} as well
    const isLiked = post.likes.get(userId) //fetch data from the map with the userId

    //if post is already liked, delete the entry in the like map of the post object
    if (isLiked) {
      post.likes.delete(userId)
    } else {
      post.likes.set(userId, true)
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )
    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
