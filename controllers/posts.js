import PostMessage from "../models/postmessages.js";
import mongoose from "mongoose";

export const getPost = async (req, res, next) => {
    const { id } = req.params
    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
export const getPosts = async (req, res, next) => {
    const { page } = req.query
    try {
        const LIMIT = 8
        const STARTINDEX = (Number(page) - 1) * LIMIT
        const total = await PostMessage.countDocuments({})
        const postMessages = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(STARTINDEX);

        res.status(200).json({ data: postMessages, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
export const getPostsBySearch = async (req, res, next) => {
    const { searchQuery, tags } = req.query
    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({
            $or: [{ title }, { tags: { $in: tags.split(',') } }]
        })

        res.status(200).json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res, next) => {
    const { title, message, name, selectedFile, tags } = req.body;

    const newPostMessage = new PostMessage({ title, message, name, selectedFile, tags, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updatePost = async (req, res, next) => {
    const _id = req.params.id;
    const post = req.body;


    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with this id')
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.json(updatedPost)
}
export const deletePost = async (req, res, next) => {
    const _id = req.params.id;


    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with this id')
    }
    await PostMessage.findByIdAndDelete(_id);

    res.json({ message: 'successfully deleted' })
}

export const likePost = async (req, res, next) => {
    const _id = req.params.id;

    if (!req.userId) {
        res.json({ message: "User is not authenticated" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with this id')
    }

    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId)
    }
    else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });

    res.json(updatedPost)
}
export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};