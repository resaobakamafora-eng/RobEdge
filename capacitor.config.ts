import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.robedge.app",
  appName: "RobEdge",
  webDir: "dist",
  backgroundColor: "#0B0E14",
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
  },
  android: {
    backgroundColor: "#0B0E14",
  },
};

export default config;
