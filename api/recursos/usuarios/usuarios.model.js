
const accountSid = '';
const authToken = '';
const keyAuthy = '';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const twilioClient = require('twilio')(accountSid, authToken);
const authy = require('authy')(keyAuthy);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Usuario debe tener un username']
  },
  password: {
    type: String,
    required: [true, 'Usuario debe tener una contraseña']
  },
  email: {
    type: String,
  },
  phone:{
    type: String,
    required: [true, 'Usuario debe tener un telefono'],
  },
  countryCode: {
    type: String,
    required: true,
  },
  authyId: String,
  verified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre('save', function(next) {
  const self = this;

  // only hash the password if it has been modified (or is new)
  if (!self.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(self.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          self.password = hash;
          next();
      });
  });
});

// Test candidate password
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  const self = this;
  bcrypt.compare(candidatePassword, self.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

// Send a verification token to this user
UserSchema.methods.sendAuthyToken = function(cb) {
  var self = this;

  if (!self.authyId) {
      // Register this user if it's a new user
      authy.register_user(self.email, self.phone, self.countryCode,
          function(err, response) {
          if (err || !response.user) return cb.call(self, err);
          self.authyId = response.user.id;
          self.save(function(err, doc) {
              if (err || !doc) return cb.call(self, err);
              self = doc;
              sendToken();
          });
      });
  } else {
      // Otherwise send token to a known user
      sendToken();
  }

  // With a valid Authy ID, send the 2FA token for this user
  function sendToken() {
      authy.request_sms(self.authyId, true, function(err, response) {
          cb.call(self, err);
      });
  }
};

// Test a 2FA token
UserSchema.methods.verifyAuthyToken = function(otp, cb) {
  const self = this;
  authy.verify(self.authyId, otp, function(err, response) {
      cb.call(self, err, response);
  });
};

// Send a text message via twilio to this user
UserSchema.methods.sendMessage =
function(message, successCallback, errorCallback) {
    const self = this;
    const toNumber = `+${self.countryCode}${self.phone}`;

    twilioClient.messages.create({
        to: toNumber,
        from: '+15202143363',
        body: message,
    }).then(function() {
      successCallback();
    }).catch(function(err) {
      errorCallback(err);
    });
};


module.exports = mongoose.model('usuario', UserSchema);