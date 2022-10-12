import express from 'express'
import { commentPost, getPost, getPosts, createPost, updatePost, deletePost, likePost, getPostsBySearch } from '../controllers/posts.js'
import isAuth from '../middelware/is-auth.js';

const router = express.Router();

router.get('/search', getPostsBySearch)
router.get('/', getPosts)
router.get('/:id', getPost)

router.post('/', isAuth, createPost)
router.patch('/:id', isAuth, updatePost)
router.delete('/:id', isAuth, deletePost)
router.patch('/:id/likepost', isAuth, likePost)
router.post('/:id/commentPost', isAuth, commentPost)

export default router;