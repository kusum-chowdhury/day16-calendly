const express = require('express');
const router= express.Router();
const Event = require('../models/eventModel');
const isAuthenticated = require('../middlewares/auth');
const { validateEmail } = require('../utils/validators');
const userModel = require('../models/userModel');
const scheduleModel = require('../models/scheduleModel');

router.post('/create', isAuthenticated, async(req, res)=> {
    try{
      const {
        menteeEmail,
        mentorID,
        schedule,
        title,
        description,
        day,
        start,
        end
      } = req.body;

      if(!validateEmail(menteeEmail)){
        return res.status(400).json({err: 'invalid email'})
      }

       const foundUser = await userModel.findById(mentorID);
       if(!foundUser){
        return res.status(404).json({err: "mentor not found"})
       }
      
       const foundSchedule = await scheduleModel.findById(schedule);
       if(!foundSchedule){
        return res.status(400).json("no availability set")
       }

       if(start < foundSchedule.dayStart || end> foundSchedule.dayEnd){
        return res.status(400).json({
            err: "Not in between available time"
        })
       }
       const foundClashingMenteeEvent = await Event.findOne({
        menteeEmail,
        day,
        start: {$lte: end},
        end: {$gte: start}
       });

       if(foundClashingMenteeEvent){
        return res.status(400).json({
            err: "clashing meetings"
        })
       }

       const foundClashingMentorEvent = await Event.findOne({
        mentorID,
        day,
        start: {$lte: end},
        end: { $gte: start}
       })
       if(foundClashingMentorEvent){
        return res.status(400).json({
            err: "clashing meetings"
        })
       }

       const newEvent = new Event({
        menteeEmail,
        mentorID,
        schedule,
        title,
        description,
        day,
        start,
        end
       })
         await newEvent.save();
         foundUser.events.push(newEvent);
         foundSchedule.events.push(newEvent);
         await foundUser.save();
         await foundSchedule.save();
         return res.status(201).json(newEvent)
    }catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
      }
});

router.get('/get/eventID', isAuthenticated, async(req, res)=> {
    try{
    const foundEvent = await Event.findById(req.params.eventID);
    if(!foundEvent){
        return res.status(404).json({err: "no event found"})
    }
    return res.status(200).json(foundEvent)
    }catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
      }
})

router.delete('/delete/:eventID', async(req, res)=> {
    try{
      const foundEvent = await Event.findById(req.params.eventID);
      if(!foundEvent){
        return res.status(404).json({err: "no event found with this id"})
      }
      
      const foundUser = await userModel.findById(req.user.id);
      if(!foundUser){
        return res.status(400).json({
            err: "user not found"
        });
      }

      const foundSchedule = await scheduleModel.findById(foundEvent.schedule);
      if(!foundSchedule){
        return res.status(400).json({err: "schedule not found"})
      }
     
      await foundUser.events.pull(foundEvent);
      await foundUser.save();
      await foundSchedule.events.pull(foundEvent);
      await foundSchedule.save();
      await foundEvent.delete();

      return res.status(200).json({msg: "event deleted"})


    }catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
      }
})

module.exports = router;