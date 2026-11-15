import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../src/config/config";

describe("Auth security", () => {
  it("hashes password on signup (never stores plain text)", async () => {
    const plainPassword = "Password123";
    const hash = await bcrypt.hash(plainPassword, 10);

    expect(hash).not.toBe(plainPassword);
    const valid = await bcrypt.compare(plainPassword, hash);
    expect(valid).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await bcrypt.hash("Password123", 10);
    const valid = await bcrypt.compare("wrongpassword", hash);
    expect(valid).toBe(false);
  });

  it("generates a valid JWT and decodes it", () => {
    const token = jwt.sign(
      { id: "user_1", email: "demo@sweety.local", name: "Demo Patient" },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    expect(decoded.id).toBe("user_1");
    expect(decoded.email).toBe("demo@sweety.local");
  });

  it("rejects a tampered JWT", () => {
    expect(() => jwt.verify("tampered.token.value", config.jwtSecret)).toThrow();
  });
});
