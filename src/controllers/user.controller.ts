import { Request, Response } from "express";
import { ApiResponse } from "@utils/ApiResponse.util";
import { asyncHandler } from "@utils/asyncHandler.util";

interface AuthRequest extends Request {
  user?: any;
}

export class UserController {
  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    // isLoggedIn middleware will attach user to req if logged in, or null if not
    if (!req.user) {
      return res.status(200).json(new ApiResponse(200, { isLoggedIn: false }, "User is not logged in"));
    }

    return res.status(200).json(new ApiResponse(200, { isLoggedIn: true, user: req.user }, "User is logged in"));
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear the access token cookie
    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0), // Set to past date to delete cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
  });
}