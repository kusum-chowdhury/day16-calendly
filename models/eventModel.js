const Mongoose = require('mongoose');

const eventSchema = new Mongoose.Schema({
  menteeEmail: {
    type: String,
    required: true,
  },
  mentorID: {
    type: ObjectId,
    ref: "User"
  },
  schedule: {
    type: ObjectId,
    ref: "Schedule"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  day: {
    type: Date,
    required: true
},
start: {
    type: Date,
    required: true
},
end: {
    type: Date,
    required: true
}
})

module.exports = Mongoose.model("Schedule", eventSchema);