import fs from "fs";
import path from "path";

// log directory
const logDir = path.join(process.cwd(), "logs");

// ensure directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "login.log");

// function to write log
export function writeLog(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
}