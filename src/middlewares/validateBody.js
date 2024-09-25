export const validateBody = (schema) => async (req, res, next) => {
  const { body } = req;

  try {
    await schema.validateAsync(body, { abortEarly: false });
    next();
  } catch (err) {
    next(err);
  }
};
