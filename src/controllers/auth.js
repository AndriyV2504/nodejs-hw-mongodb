import { loginUser, registerUser } from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

export const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });

  res.status(200).json({
    status: 200,
    message: 'Successfully registered a user!',
    data: serializeUser(user),
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  await loginUser({ email, password });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
  });
};
