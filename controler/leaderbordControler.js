const User = require("../model/usermodel");

const getExpence = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([

      { $project: { name: 1,totalExpence: 1, }, },
      { $sort: { totalExpence: -1, },},
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
};

module.exports = { getExpence };
