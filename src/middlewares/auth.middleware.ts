import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BaseUser } from "../models/User.model";
import { ApiError } from "@utils/ApiError.util";

interface AuthRequest extends Request {
  user?: any;
}

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extract token from cookie
    const token = req.cookies?.access_token;

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify token
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Find user and attach to request
    const user = await BaseUser.findById(decodedToken?.id).select("-password -deletedAt");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
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
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

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