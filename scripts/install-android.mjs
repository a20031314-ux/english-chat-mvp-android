/**
 * Build the app and put it on a phone over USB.
 *
 * The loop this exists for is adding a feature and seeing it on real hardware —
 * a real microphone, real permissions, a real Play listing to open — which is
 * the only place a good part of this app can actually be checked. The web
 * preview cannot open a microphone the way Android does, and the closed testing
 * track is days of round trip.
 *
 * A debug build installs beside the Play one rather than replacing it: the
 * package id carries a ".debug" suffix (android/app/build.gradle), so the
 * store's copy and its data are never touched. Two apps on the phone, and the
 * one being worked on is the one with "-debug" in its version.
 *
 * Two things this handles that are otherwise a paper cut every time. It finds a
 * JDK rather than requiring JAVA_HOME to be set, because gradle refuses without
 * one and Android Studio ships a perfectly good JDK that nothing points at. And
 * it checks for a phone before building, because finding out after a five
 * minute build is the annoying way to learn the cable is out.
 *
 * Run: npm run install:android
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const onWindows = process.platform === "win32";

/** Where a JDK is, whatever the machine has decided to call it. */
function findJavaHome() {
  const fromEnv = process.env.JAVA_HOME?.trim();
  if (fromEnv && existsSync(path.join(fromEnv, "bin", onWindows ? "java.exe" : "java"))) {
    return { home: fromEnv, source: "JAVA_HOME" };
  }
  // Android Studio's bundled runtime, which is the JDK gradle wants anyway and
  // is already on the machine of anyone who can build this at all.
  const candidates = [
    process.env.STUDIO_JDK,
    path.join(process.env.LOCALAPPDATA ?? "", "Programs", "Android Studio", "jbr"),
    "C:/Program Files/Android/Android Studio/jbr",
    "/Applications/Android Studio.app/Contents/jbr/Contents/Home",
    path.join(process.env.HOME ?? "", "Android/Studio/jbr"),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, "bin", onWindows ? "java.exe" : "java"))) {
      return { home: candidate, source: "Android Studio" };
    }
  }
  return null;
}

/** Where adb is, so a missing phone can be reported before anything is built. */
function findAdb() {
  const sdk =
    process.env.ANDROID_HOME ??
    process.env.ANDROID_SDK_ROOT ??
    path.join(process.env.LOCALAPPDATA ?? "", "Android", "Sdk");
  const adb = path.join(sdk, "platform-tools", onWindows ? "adb.exe" : "adb");
  return existsSync(adb) ? adb : null;
}

function attachedDevices(adb) {
  const result = spawnSync(adb, ["devices"], { encoding: "utf8" });
  if (result.status !== 0) return [];
  return result.stdout
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line.endsWith("\tdevice"))
    .map((line) => line.split("\t")[0]);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: onWindows,
    ...options,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const adb = findAdb();
if (!adb) {
  console.error(
    "Could not find adb. Set ANDROID_HOME to the Android SDK, or install the platform-tools from Android Studio.",
  );
  process.exit(1);
}

const devices = attachedDevices(adb);
if (devices.length === 0) {
  console.error(
    "No phone attached.\n" +
      "  - plug it in over USB\n" +
      "  - turn on Developer options, then USB debugging\n" +
      "  - accept the prompt on the phone that asks whether to trust this computer\n" +
      `then check with: ${adb} devices`,
  );
  process.exit(1);
}
console.log(`Installing to ${devices.join(", ")}.`);

const java = findJavaHome();
if (!java) {
  console.error(
    "Could not find a JDK. Set JAVA_HOME, or install Android Studio, which brings one.",
  );
  process.exit(1);
}
console.log(`Building with the JDK from ${java.source}: ${java.home}`);

run("npm", ["run", "build:android"]);
run(path.join(root, "android", onWindows ? "gradlew.bat" : "gradlew"), ["installDebug"], {
  cwd: path.join(root, "android"),
  env: { ...process.env, JAVA_HOME: java.home },
});

console.log(
  "\nInstalled. It sits beside the Play build — look for the one whose version ends in -debug.\n" +
    "Note that it is a separate app to the server: its own free allowance, and no subscription,\n" +
    "because purchases only work in a build Play installed.",
);
