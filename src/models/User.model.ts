import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// --------------------
// Interfaces
// --------------------
interface IBaseUser extends Document {
  username: string;
  fname: string;
  lname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isProfilePictureSet?: boolean;
  isActive?: boolean;
  isAdmin?: boolean;
  deletedAt?: Date | null;
  password?: string; // only for direct login
  provider: "direct" | "google" | "github";

  __v?: number; // Mongoose version key (readonly)
  
  isPasswordCorrect?: (password: string) => Promise<boolean>;
  softDelete: () => Promise<void>;
  restore: () => Promise<void>;
}

interface IBaseUserModel<T extends Document> extends Model<T> {
  findActive: (filter?: object) => ReturnType<typeof mongoose.Model.find>;
}

// --------------------
// Base Schema
// --------------------
const BaseUserSchema = new Schema<IBaseUser>(
  {
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
    fname: { type: String, required: true, trim: true, maxlength: 50 },
    lname: { type: String, required: true, trim: false, maxlength: 50 },
    email: { type: String, lowercase: true, trim: true, maxlength: 50, unique: true, sparse: true },
    phone: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^([+]91[- ]?)?[6-9]\d{9}$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
      unique: true,
      sparse: true,
    },
    avatar: { type: String, default: "" },
    isProfilePictureSet: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    password: { type: String, minlength: 8 }, // only for direct login
  },
  { timestamps: true, discriminatorKey: "provider", collection: "users" }
);

// --------------------
// Middleware
// --------------------

// Automatically hash password before saving (for direct login)
BaseUserSchema.pre<IBaseUser>("save", async function (next) {
  if (this.provider === "direct" && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
  }
  next();
});

// Automatically exclude soft-deleted users
function excludeDeleted(this: any, next: any) {
  this.where({ deletedAt: null });
  next();
}

BaseUserSchema.pre("find", excludeDeleted);
BaseUserSchema.pre("findOne", excludeDeleted);
BaseUserSchema.pre("findOneAndUpdate", excludeDeleted);
// BaseUserSchema.pre("count", excludeDeleted);
BaseUserSchema.pre("countDocuments", excludeDeleted);


// --------------------
// Schema options to hide sensitive fields
// --------------------
BaseUserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;    // remove password
    delete ret.__v;         // optional: remove __v
    delete ret.deletedAt;   // optional: hide soft-delete info
    return ret;
  },
});

BaseUserSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.deletedAt;
    return ret;
  },
});

// --------------------
// Instance Methods
// --------------------
BaseUserSchema.methods.isPasswordCorrect = async function (password: string) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

BaseUserSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  await this.save();
};

BaseUserSchema.methods.restore = async function () {
  this.deletedAt = null;
  await this.save();
};

// --------------------
// Static Methods
// --------------------
BaseUserSchema.statics.findActive = function (filter = {}) {
  return this.find({ deletedAt: null, ...filter });
};

// --------------------
// Model & Discriminators
// --------------------
const BaseUser = mongoose.model<IBaseUser, IBaseUserModel<IBaseUser>>("BaseUser", BaseUserSchema);

// Direct login (email/password)
const EmailUser = BaseUser.discriminator(
  "direct",
  new Schema({ password: { type: String, required: true } })
);

// Google login
const GoogleUser = BaseUser.discriminator(
  "google",
  new Schema({ googleId: { type: String, required: true } })
);

// GitHub login
const GithubUser = BaseUser.discriminator(
  "github",
  new Schema({ githubId: { type: String, required: true } })
);

export { type IBaseUser, BaseUser, EmailUser, GoogleUser, GithubUser };