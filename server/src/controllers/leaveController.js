import LeaveRequest from '../models/LeaveRequest.js';

export const requestLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    const leaveRequest = new LeaveRequest({
      user: req.user.userId,
      startDate,
      endDate,
      reason,
    });

    await leaveRequest.save();

    res.status(201).json({ message: 'Leave request created', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.status = 'approved';
    await leaveRequest.save();

    res.status(200).json({ message: 'Leave request approved', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.status = 'rejected';
    await leaveRequest.save();

    res.status(200).json({ message: 'Leave request rejected', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    // Fetch all leave requests from the database and sort by createdAt in descending order
    const leaveRequests = await LeaveRequest.find().populate('user', 'name email role').sort({ createdAt: -1 });

    if (leaveRequests.length === 0) {
      return res.status(200).json({ message: 'No leave requests found.' });
    }

    res.status(200).json({
      success: true,
      leaveRequests,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
