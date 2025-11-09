import { Request, Response } from "express";
import { AuthService } from "@services/Auth.service";
import { ApiError } from "@utils/ApiError.util";
import { ApiResponse } from "@utils/ApiResponse.util";
import { asyncHandler } from "@utils/asyncHandler.util";
import { sendEmail } from "@utils/sendEmail.util";

import { welcomeEmail } from "@templates/welcomeEmail";

export class AuthController {
  static test = asyncHandler(async (req:Request,res:Response)=>{
    await sendEmail({
      to: "ks2596050@gmail.com",
      subject: "Welcome to Our App 🎉",
      html: welcomeEmail("Kuldeep")
    });
    res.status(200).json(new ApiResponse(200,{},"Success"));
  })

  static registerDirect = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.registerDirect(req.body);
    if (!user) throw ApiError.BadRequest("User registration failed");

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  });

  static loginDirect = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.loginDirect(req.body);
    if (!result) throw ApiError.Unauthorized("Invalid credentials");

    // Set JWT as HttpOnly cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: isProduction, // Only true in production (with HTTPS)
      sameSite: isProduction ? "none" : "lax", // "none" requires secure: true, so use "lax" in dev
      maxAge: 1000 * 60 * 60, // 1 hr
      path: "/",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { user: result.user }, "Login successful"));
  });

  static loginOAuth = asyncHandler(async (req: Request, res: Response) => {
    console.log("Trying to Enter the OAuth Credentials", process.env.NODE_ENV === "production");

    if (req.body.provider === "google") {
      const output = await AuthService.verifyGoogleToken(req.body?.idToken);
      if(!output) throw ApiError.Unauthorized("Issue in the google auth Api");

      const result = await AuthService.loginOAuth(output);
      if (!result) throw ApiError.Unauthorized("OAuth login failed");

      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("access_token", result.access_token, {
        httpOnly: true,
        secure: isProduction, // Only true in production (with HTTPS)
        sameSite: isProduction ? "none" : "lax", // "none" requires secure: true, so use "lax" in dev
        maxAge: 1000 * 60 * 60, // 1 hr
        path: "/",
      });

      return res.status(200)
        .json(new ApiResponse(200, { user: result.user }, "OAuth login successful"));
    }
    else if(req.body.provider === "github") {
      const { idToken } = req.body;
      if (!idToken) throw ApiError.BadRequest("Missing GitHub code");

      const accessToken = await AuthService.getGithubAccessToken(idToken);
      const githubUser = await AuthService.getGithubUser(accessToken);
      const result = await AuthService.loginOAuth(githubUser);

      // Set JWT as HttpOnly cookie
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("access_token", result.access_token, {
        httpOnly: true,
        secure: isProduction, // Only true in production (with HTTPS)
        sameSite: isProduction ? "none" : "lax", // "none" requires secure: true, so use "lax" in dev
        maxAge: 1000 * 60 * 60, // 1 hr
        path: "/",
      });

      return res.status(200).json(new ApiResponse(200, result, "OAuth login successful"));
    }
    throw ApiError.BadRequest("Invalid provider for OAuth");
  });

  static softDelete = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.softDelete(req.params.id);
    if (!user) throw ApiError.NotFound("User not found");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User soft deleted"));
  });

  static restore = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.restore(req.params.id);
    if (!user) throw ApiError.NotFound("User not found or already active");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User restored successfully"));
  });
}
