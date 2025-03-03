module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>/unit"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
