// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
// const validator = require("validator");
// // mongoose.plugin(require('mongoose-paginate-v2')); // Uncomment for pagination

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: [true, "Please provide your email"],
//       unique: true,
//       lowercase: true,
//       validate: [validator.isEmail, "Please provide a valid email"],
//     },
//     username: {
//       type: String,
//       required: [true, "Please choose a username"],
//       unique: true,
//       trim: true,
//       minlength: [3, "Username must be at least 3 characters"],
//       maxlength: [30, "Username cannot exceed 30 characters"],
//     },
//     password: {
//       type: String,
//       required: [true, "Please provide a password"],
//       minlength: [6, "Password must be at least 6 characters"],
//       select: false,
//     },
//     passwordChangedAt: Date,
//     role: {
//       type: String,
//       enum: ["user", "admin", "moderator"],
//       default: "user",
//     },
//     status: {
//       type: String,
//       enum: ["active", "suspended", "inactive"],
//       default: "active",
//     },
//     profile: {
//       firstName: {
//         type: String,
//         trim: true,
//         maxlength: [50, "First name cannot exceed 50 characters"],
//       },
//       lastName: {
//         type: String,
//         trim: true,
//         maxlength: [50, "Last name cannot exceed 50 characters"],
//       },
//       avatar: {
//         type: String,
//         default: function () {
//           return `https://www.gravatar.com/avatar/${crypto
//             .createHash("md5")
//             .update(this.email)
//             .digest("hex")}?d=identicon`;
//         },
//       },
//       bio: {
//         type: String,
//         maxlength: [500, "Bio cannot exceed 500 characters"],
//       },
//       website: {
//         type: String,
//         validate: [validator.isURL, "Please provide a valid URL"],
//       },
//     },
//     socials: {
//       twitter: String,
//       facebook: String,
//       linkedin: String,
//       github: String,
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//     verifyEmailToken: String,
//     verifyEmailExpire: Date,
//     emailVerified: {
//       type: Boolean,
//       default: false,
//     },
//     lastLogin: Date,
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // Indexes
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ username: 1 }, { unique: true });

// // Password hashing middleware
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 12);
//   this.passwordChangedAt = Date.now() - 1000; // Ensures token created after password change
//   next();
// });

// // Update email verification status when email changes
// userSchema.pre("save", function (next) {
//   if (this.isModified("email") && !this.isNew) {
//     this.emailVerified = false;
//     this.verifyEmailToken = undefined;
//     this.verifyEmailExpire = undefined;
//   }
//   next();
// });

// // Instance method to check password
// userSchema.methods.matchPassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Generate password reset token
// userSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

//   return resetToken;
// };

// // Generate email verification token
// userSchema.methods.getEmailVerificationToken = function () {
//   const verificationToken = crypto.randomBytes(20).toString("hex");

//   this.verifyEmailToken = crypto
//     .createHash("sha256")
//     .update(verificationToken)
//     .digest("hex");

//   this.verifyEmailExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

//   return verificationToken;
// };

// // Check if user changed password after token was issued
// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     return JWTTimestamp < changedTimestamp;
//   }
//   return false;
// };

// // Virtuals
// userSchema.virtual("fullName").get(function () {
//   return `${this.profile.firstName} ${this.profile.lastName}`.trim();
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
