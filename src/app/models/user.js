const mongoose = require('../../database/connection');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next) {

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

/** Você pode utilizar statics functions para buscas personalizadas
 * http://mongoosejs.com/docs/api.html#schema_Schema-static
 * EX:
   movieSchema.statics.findAllWithCreditCookies = (callback) => {
   this.find({ hasCreditCookie: true }, callback);
  };
 * **/

const User = mongoose.model('User', UserSchema);

module.exports = User;
