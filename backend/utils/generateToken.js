import jwt from 'jsonwebtoken';

const generateToken = (id, res) => {
  try {
    // Generate the token
    const token = jwt.sign({ id }, process.env.JWT_SEC, {
      expiresIn: '15d',
    });

    // Set the token in a cookie
    res.cookie('token', token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
      sameSite: 'strict', // 'lax' or 'none' might be used depending on your use case
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
};

export default generateToken;
