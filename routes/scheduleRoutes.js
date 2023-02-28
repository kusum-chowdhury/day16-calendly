const express = require("express");
const router = express.Router();
const isAuthenticated = require('../middlewares/auth');

const Schedule = require('../models/scheduleModel');
const User = require('../models/userModel');

router.post("/create", isAuthenticated, async(req, res) => {
    try{
     const {day, dayStart, dayEnd, eventDuration } =req.body;
     const user = req.user.id;
     const foundUser = await User.findById(user);

     if(!foundUser){
        return res.status(404).json({err: "user not found"});
     }

     const presentSchedule = await schedule.findOne({user, day});
     
    if(presentSchedule){
        return res.status(403).json({err: "schedule already exists"});
    }

    const newSchedule = new Schedule({
        user,
        day,
        dayStart,
        dayEnd,
        eventDuration
    });

    await newSchedule.save();
    foundUser.schedules.push(newSchedule);
    await foundUser.save();
    return res.status(200).json(newSchedule)

    }catch(e){
        return res.status(500).json({err: e})
    }
})

router.get("/get/:userID", async(req, res)=> {
    try{
    const foundUser = await User.findById(req.params.userID);
    if(!foundUser){
        return res.status(404).json({err: "user not found"}); 
    }

    const schedule = await Schedule.find({user: req.params.userID});
    res.status(200).json(schedule);
    }catch(e){}
})

router.put("/update/:scheduleID", isAuthenticated, async (req, res) => {
    try {
      const foundSchedule = await Schedule.findById(req.params.scheduleID);
  
      if (!foundSchedule) {
        return res.status(404).json({ err: "Schedule not found" });
      }
  
      if (foundSchedule.events.length > 0) {
        return res
          .status(403)
          .json({ err: "Cannot delete schedule with events" });
      }
  
      const { day, dayStart, dayEnd, eventDuration } = req.body;
  
      const scheduleStart = Number(dayStart.replace(":", "."));
      const scheduleEnd = Number(dayEnd.replace(":", "."));
  
      const updatedSchedule = await Schedule.updateOne(
        { _id: req.params.scheduleID },
        { day, dayStart: scheduleStart, dayEnd: scheduleEnd, eventDuration }
      );
      res.status(200).json(updatedSchedule);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });


  router.delete("/delete/:scheduleID", isAuthenticated, async (req, res) => {
    try {
      const foundUser = await User.findById(req.user.id);
  
      if (!foundUser) {
        return res.status(404).json({ err: "User not found" });
      }
  
      const foundSchedule = await Schedule.findById(req.params.scheduleID);
  
      if (!foundSchedule) {
        return res.status(404).json({ err: "Schedule not found" });
      }
  
      if (foundSchedule.events.length > 0) {
        return res
          .status(403)
          .json({ err: "Cannot delete schedule with events" });
      }
  
      await Schedule.findByIdAndDelete(req.params.scheduleID);
      foundUser.schedules.pull(req.params.scheduleID);
      await foundUser.save();
  
      res.status(200).json({ msg: "Schedule deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err.message });
    }
  });

  
module.exports = router;