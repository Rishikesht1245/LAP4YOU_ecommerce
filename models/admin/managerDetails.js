const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    default: "Manager@1245",
  },
  roles: {
    type: [String], // or define a subdocument schema for more complex access control
    required: true,
  },
  access: {
    type: Boolean,
    default: true,
  },
});

managerSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const managerCLTN = new mongoose.model("Managers", managerSchema);

module.exports = managerCLTN;
