const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const BlogPost = require('../models/BlogPost');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all blog posts - public route
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query = {};
    
    // If user is not authenticated or not admin, only show published posts
    if (!req.user || !req.user.isAdmin) {
      query.status = 'published';
    }
    
    const posts = await BlogPost.find(query)
      .populate('author', 'username isAdmin')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
});

// Get all unique tags - public route
router.get('/tags', async (req, res) => {
  try {
    const tags = await BlogPost.distinct('tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
});

// Get single post - public route
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'username isAdmin');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// Protected routes below - require authentication
// Create post
router.post('/', auth, async (req, res) => {
  try {
    const post = new BlogPost({
      ...req.body,
      author: req.user._id,
    });
    await post.save();
    const populatedPost = await BlogPost.findById(post._id)
      .populate('author', 'username isAdmin');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('author', 'username isAdmin');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

module.exports = router; 