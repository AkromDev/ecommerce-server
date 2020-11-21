const Token = require('../models/token');
const User = require('../models/user');

exports.confirmationPost = async function (req, res) {
  const { token } = req.params;

  // Find a matching token
  const tokenObj = await Token.findOne({ token: token });
  if (!tokenObj)
    return res.status(400).send({
      type: 'not-verified',
      message:
        'We were unable to find a valid token. Your token my have expired.',
    });

  // If we found a token, find a matching user
  const user = await User.findOne({
    _id: tokenObj.userId,
  });
  if (!user)
    return res
      .status(400)
      .send({ message: 'We were unable to find a user for this token.' });
  if (user.isVerified)
    return res.status(400).send({
      type: 'already-verified',
      message: 'This user has already been verified.',
    });

  // Verify and save the user
  user.isVerified = true;
  user.save(function (err) {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    res.status(200).send('The account has been verified. Please log in.');
  });
};
