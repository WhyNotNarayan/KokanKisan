const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const CalendarEvent = require('../models/CalendarEvent');
const Blog = require('../models/Blog');
const Drive = require('../models/Green');
const { generateId } = require('../utils/helpers');

const router = express.Router();

router.get('/events', async (req, res) => {
  try {
    const { year } = req.query;
    const y = year ? parseInt(year) : new Date().getFullYear();

    const custom = await CalendarEvent.find({
      date: {
        $gte: new Date(y, 0, 1),
        $lte: new Date(y, 11, 31),
      },
    });

    const festivals = CalendarEvent.getIndianFestivals(y).map((f) => ({
      title: f.title,
      date: f.date,
      type: 'festival',
    }));

    const blogs = await Blog.find({ status: 'published' }).select('title festivalDate blogId');
    const blogEvents = blogs
      .filter((b) => b.festivalDate)
      .map((b) => ({
        title: b.title,
        date: b.festivalDate,
        type: 'blog',
        link: `/culture/${b.blogId}`,
      }));

    const drives = await Drive.Drive.find().select('title date driveId');
    const driveEvents = drives.map((d) => ({
      title: d.title,
      date: d.date,
      type: 'drive',
      link: `/green`,
    }));

    res.json([...festivals, ...custom, ...blogEvents, ...driveEvents]);
  } catch (err) {
    console.error('Calendar events error:', err);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

router.use(auth, roleCheck('admin'));

router.post('/events', async (req, res) => {
  try {
    const { title, date, description, link } = req.body;
    const event = await CalendarEvent.create({
      eventId: generateId(),
      title,
      date,
      description: description || '',
      link: link || '',
      type: 'custom',
      createdBy: 'admin',
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event.' });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    await CalendarEvent.findOneAndDelete({ eventId: req.params.id });
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

module.exports = router;
