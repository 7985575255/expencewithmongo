const User = require('../model/usermodel');
const ForgotPasswordRequest = require('../model/forgetpasswordmodel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.YOUR_API_KEY;

// Sendinblue client setup
const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();

exports.getForgetpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const id = uuidv4();
    const forgotPasswordRequest = await ForgotPasswordRequest.create({
      isActive: true,
      UserId: user._id, 
    });

    const resetUrl = `/password/reset-password/${forgotPasswordRequest._id}`; // Use _id for Mongoose

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = 'Password Reset';
    sendSmtpEmail.htmlContent = `Click the following link to reset your password: ${resetUrl}`;
    sendSmtpEmail.sender = { name: 'Test Company', email: 'varmaji21217@gmail.com' };
    sendSmtpEmail.to = [{ email }];
    
    sendinblue.sendTransacEmail(sendSmtpEmail)
      .then(() => {
        res.status(200).json({ message: 'Email sent successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Failed to send email' });
      });

  } catch (err) {
    console.log("Error is coming in the catch block", err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  try {
    const forgotPasswordRequest = await ForgotPasswordRequest.findById(id); // Use findById for Mongoose

    if (!forgotPasswordRequest || !forgotPasswordRequest.isActive) {
      return res.status(404).json({ message: 'Invalid password reset request' });
    }

    res.send(`
      <h1>Reset Password</h1>
      <form action="/password/reset-password/${id}" method="post">
        <label for="password">New Password:</label>
        <input type="password" id="password" name="password" required>
        <button type="submit">Submit</button>
      </form>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const forgotPasswordRequest = await ForgotPasswordRequest.findById(id); // Use findById for Mongoose

    if (!forgotPasswordRequest || !forgotPasswordRequest.isActive) {
      return res.status(404).json({ message: 'Invalid password reset request' });
    }

    const user = await User.findById(forgotPasswordRequest.UserId); // Use findById for Mongoose

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Deactivate the forgot password request
    forgotPasswordRequest.isActive = false;
    await forgotPasswordRequest.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
