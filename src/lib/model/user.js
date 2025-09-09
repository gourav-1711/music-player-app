import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteSongs: {
    type: [Object], // array of objects
    default: [],
  },
  history: {
    type: [Object],
    default: [],
  },
  playlist: {
    type: Object,
    default: {},
  },
});

const user = mongoose.models.User || mongoose.model("Music-Users", UserSchema);

export default user;
