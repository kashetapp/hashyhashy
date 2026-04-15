import bcrypt from "bcryptjs";
import { argon2id } from "hash-wasm";

export type Algorithm = "bcrypt" | "sha256" | "argon2";

export async function hashPassword(password: string, algorithm: Algorithm): Promise<string> {
  switch (algorithm) {
    case "bcrypt": {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    }
    case "sha256": {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    case "argon2": {
      const salt = new Uint8Array(16);
      crypto.getRandomValues(salt);
      return argon2id({
        password,
        salt,
        parallelism: 1,
        iterations: 3,
        memorySize: 4096,
        hashLength: 32,
        outputType: "encoded",
      });
    }
    default:
      throw new Error("Unsupported algorithm");
  }
}
