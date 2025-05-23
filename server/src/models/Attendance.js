// import mongoose from 'mongoose';

// const AttendanceSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     punchInTime: {
//       type: Date,
//     },                                                      
//     punchOutTime: {
//       type: Date,
//     },
//     punchInPhoto: {
//       type: String,
//     },  
//     punchOutPhoto: {
//       type: String,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//       expires: 60 * 60 * 24 * 30, // 30 days in seconds
//     },
//   },
//   { timestamps: true }
// );

// const Attendance = mongoose.model('Attendance', AttendanceSchema);
// export default Attendance;


import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    punchInTime: {
      type: Date,
    },
    punchOutTime: {
      type: Date,
    },
    punchInPhoto: {
      type: String,
    },
    punchOutPhoto: {
      type: String,
    },
    totalWorkTime: {
      type: String, // Store the total time worked as a string (e.g., "4 hours 30 minutes")
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // 30 days in seconds
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model('Attendance', AttendanceSchema);
export default Attendance;

