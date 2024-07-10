const jwt = require("jsonwebtoken");

// Define the secret key directly in the code
const JWT_SECRET = "secret"; // Replace this with your actual secret

const generateToken = (id) => {
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
  // console.log(`Generated Token: ${token}`); // Log the generated token
  return token;
};

module.exports = generateToken;
