import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BaseUser } from "../models/User.model";
import { ApiError } from "@utils/ApiError.util";

interface AuthRequest extends Request {
  user?: any;
}

// Verify JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("CRITICAL ERROR: JWT_SECRET environment variable is not set in middleware!");
  console.error("Please set JWT_SECRET in your environment variables.");
  process.exit(1); // Exit if not configured properly
}

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extract token from cookie
    const token = req.cookies?.access_token;

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify token
    const decodedToken: any = jwt.verify(token, JWT_SECRET);

    // Find user and attach to request
    const user = await BaseUser.findById(decodedToken?.id).select("-password -deletedAt");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid or expired token");
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token has expired");
    } else if (error instanceof jwt.NotBeforeError) {
      throw new ApiError(401, "Token not yet valid");
    } else {
      throw new ApiError(401, "Invalid or expired token");
    }
  }
};

export const isLoggedIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extract token from cookie
    const token = req.cookies?.access_token;

    if (!token) {
      // User is not logged in, but don't throw an error - this middleware is for checking status
      req.user = null;
      return next();
    }

    // Verify token
    const decodedToken: any = jwt.verify(token, JWT_SECRET);

    // Find user and attach to request
    const user = await BaseUser.findById(decodedToken?.id).select("-password -deletedAt");

    if (!user) {
      // Token is invalid, so user is not logged in
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    // Token is invalid, so user is not logged in
    req.user = null;
    next();
  }
};