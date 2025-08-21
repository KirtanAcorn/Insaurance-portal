const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const claimsRoutes = require("./routes/claimsRoutes");
const policyRoutes = require("./routes/policyRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/api/users", userRoutes);
app.use("/api/claims", claimsRoutes);
app.use("/api/policies", policyRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT}`);
});
