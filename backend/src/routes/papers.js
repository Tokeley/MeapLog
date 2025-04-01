const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ResearchPaper = require('../models/ResearchPaper');

// Get all papers
router.get('/', async (req, res) => {
  try {
    const papers = await ResearchPaper.find()
      .populate('addedBy', 'username isAdmin')
      .sort({ createdAt: -1 });
    res.json(papers);
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ message: 'Error fetching papers' });
  }
});

// Get all unique tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await ResearchPaper.distinct('tags');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
});

// Get single paper
router.get('/:id', async (req, res) => {
  try {
    const paper = await ResearchPaper.findById(req.params.id)
      .populate('addedBy', 'username isAdmin');
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    console.error('Error fetching paper:', error);
    res.status(500).json({ message: 'Error fetching paper' });
  }
});

// Create paper
router.post('/', async (req, res) => {
  // Get user from token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const paper = new ResearchPaper({
      ...req.body,
      addedBy: decoded.id,
    });
    await paper.save();
    const populatedPaper = await ResearchPaper.findById(paper._id)
      .populate('addedBy', 'username isAdmin');
    res.status(201).json(populatedPaper);
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({ message: 'Error creating paper' });
  }
});

// Update paper
router.put('/:id', async (req, res) => {
  try {
    const paper = await ResearchPaper.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('addedBy', 'username isAdmin');

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    console.error('Error updating paper:', error);
    res.status(500).json({ message: 'Error updating paper' });
  }
});

// Delete paper
router.delete('/:id', async (req, res) => {
  try {
    const paper = await ResearchPaper.findByIdAndDelete(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ message: 'Error deleting paper' });
  }
});

// Toggle paper read status
router.patch('/:id/toggle-read', async (req, res) => {
  try {
    const paper = await ResearchPaper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    paper.isRead = !paper.isRead;
    await paper.save();
    const populatedPaper = await ResearchPaper.findById(paper._id)
      .populate('addedBy', 'username isAdmin');
    res.json(populatedPaper);
  } catch (error) {
    console.error('Error toggling paper read status:', error);
    res.status(500).json({ message: 'Error toggling paper read status' });
  }
});

// Update paper notes
router.put('/:id/notes', async (req, res) => {
  try {
    const paper = await ResearchPaper.findByIdAndUpdate(
      req.params.id,
      { notes: req.body.notes, updatedAt: new Date() },
      { new: true }
    ).populate('addedBy', 'username isAdmin');

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    console.error('Error updating paper notes:', error);
    res.status(500).json({ message: 'Error updating paper notes' });
  }
});

module.exports = router; 