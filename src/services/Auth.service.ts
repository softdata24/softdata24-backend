import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import axios from "axios";
import { EmailUser, GoogleUser, GithubUser, BaseUser, IBaseUser } from "../models/User.model";
import { AuthRegisterDto, AuthLoginDto, AuthOAuthDto } from "../dto/Auth.dto";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Validate JWT secret is properly configured
if (!process.env.JWT_SECRET) {
  console.error("CRITICAL ERROR: JWT_SECRET environment variable is not set!");
  console.error("Please set JWT_SECRET in your environment variables.");
  process.exit(1); // Exit the application if JWT_SECRET is not configured
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "1h";

export class AuthService {
  // --------------------
  // Direct Registration
  // --------------------
  static async registerDirect(data: AuthRegisterDto): Promise<IBaseUser> {
    // Check if username or email already exists
    const existingUser = await EmailUser.findOne({
      $or: [{ username: data.username }, { email: data.email }]
    });
    if (existingUser) throw new Error("User already exists");

    const user = new EmailUser(data);
    await user.save();
    return user;
  }

  // --------------------
  // Direct Login
  // --------------------
  static async loginDirect({ usernameOrEmail, password }: AuthLoginDto) {
    const user = await EmailUser.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) throw new Error("User not found");

    const isCorrect = await user.isPasswordCorrect!(password);
    if (!isCorrect) throw new Error("Invalid credentials");

    const access_token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return { user, access_token };
  }

  // --------------------
  // Verify Google Token
  // --------------------
  static async verifyGoogleToken(idToken: string):Promise<AuthOAuthDto|null> {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log("Google token verified successfully");

      const payload = ticket.getPayload();

      if (!payload) return null;

      console.log("Google token payload:", payload);
      
      // Additional validation to make sure the token is from a valid source
      if (!payload.iss || (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com')) {
        console.error('Invalid issuer for Google token:', payload.iss);
        return null;
      }
      
      // Check if the audience matches (for security)
      const aud = payload.aud;
      console.log("Google token audience:", aud);
      if (aud !== process.env.GOOGLE_CLIENT_ID) {
        console.error('Invalid audience for Google token:', aud);
        return null;
      }

      // Step 1: Build a base username from name or email
      const baseUsername = (
        (payload.given_name && payload.family_name
          ? `${payload.given_name}.${payload.family_name}`
          : payload.email?.split("@")[0] || "user"
        )
          .replace(/[^a-zA-Z0-9._-]/g, "")
          .toLowerCase()
      ).slice(0, 25); // leave space for suffix if needed

      // Step 2: Ensure uniqueness
      let username = baseUsername;
      let counter = 0;

      while (await BaseUser.findOne({ username })) {
        counter++;
        const suffix = Math.random().toString(36).slice(2, 6); // e.g. "x9a2"
        username = `${baseUsername.slice(0, 25 - suffix.length)}_${suffix}`;
        if (username.length > 30) {
          username = username.slice(0, 30);
        }
        if (counter > 5) break; // avoid infinite loop just in case
      }

      // Step 3: Return DTO
      return {
        provider: "google",
        providerId: payload!.sub,      // unique Google ID
        email: payload!.email,
        fname: payload!.given_name ?? "",
        lname: payload!.family_name ?? "",
        username
      };
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return null;
    }
  }

  // --------------------
  // GitHub Access Token
  // --------------------
  static async getGithubAccessToken(code: string) {
    try {
      const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

      if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        throw new Error('GitHub client ID or secret not configured');
      }

      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: "application/json" },
        }
      );

      if (tokenResponse.data.error) {
        throw new Error(`GitHub OAuth error: ${tokenResponse.data.error}`);
      }

      return tokenResponse.data.access_token;
    } catch (error) {
      console.error('Error getting GitHub access token:', error);
      throw error;
    }
  };

  // --------------------
  // GitHub OAuth User Details
  // --------------------
  static async getGithubUser (accessToken: string): Promise<AuthOAuthDto> {
    try {
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const emailResponse = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const primaryEmail = emailResponse.data.find((e: any) => e.primary)?.email;

      return {
        provider: "github",
        providerId: userResponse.data.id.toString(),
        email: primaryEmail,
        username: userResponse.data.login,
        fname: userResponse.data.name?.split(" ")[0] || "",
        lname: userResponse.data.name?.split(" ")[1] || "",
      };
    } catch (error) {
      console.error('Error getting GitHub user data:', error);
      throw error;
    }
  };

  // --------------------
  // OAuth Login
  // --------------------
  static async loginOAuth({ provider, providerId, email, username, fname, lname }: AuthOAuthDto) {
    let user: IBaseUser | null;

    if (provider === "google") {
      user = await GoogleUser.findOne({ googleId: providerId });
      if (!user) {
        user = new GoogleUser({ googleId: providerId, email,
                      fname, lname, username: username ?? email });
        await user.save();
      }
    } else if (provider === "github") {
      user = await GithubUser.findOne({ githubId: providerId });
      if (!user) {
        user = new GithubUser({ githubId: providerId, email,
                      fname, lname, username: username ?? email });
        await user.save();
      }
    } else {
      throw new Error("Invalid OAuth provider");
    }

    const access_token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return { user, access_token };
  }

  // --------------------
  // Soft delete user
  // --------------------
  static async softDelete(userId: string) {
    const user = await BaseUser.findById(userId);
    if (!user) throw new Error("User not found");
    await user.softDelete();
    return user;
  }

  // --------------------
  // Restore soft-deleted user
  // --------------------
  static async restore(userId: string) {
    const user = await BaseUser.findById(userId);
    if (!user) throw new Error("User not found");
    await user.restore();
    return user;
  }
}
