import bcrypt from "bcrypt";

const testPasswordHashingAndComparison = async () => {
  const password = "Password123";
  const saltRounds = 10;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);

  // Compare the password
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log("Password match result:", isMatch);
};

testPasswordHashingAndComparison();
