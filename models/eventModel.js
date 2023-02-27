const Mongoose = require('mongoose');

const eventSchema = new Mongoose.Schema({
  menteEmail: {
    type: String,
    required: true,
  },
  mentorId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  schedule: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Schedule"
  },
  titles: {
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