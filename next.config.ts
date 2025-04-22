import type { NextConfig } from "next";

import { validateEnvs } from "./src/validateEnvVars";

const validateEnvsResult = validateEnvs();

if (!validateEnvsResult.success) {
  // eslint-disable-next-line no-console
  console.error(
    "Environment variable validation errors:",
    validateEnvsResult.error.format()
  );
  process.exit(1);
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
