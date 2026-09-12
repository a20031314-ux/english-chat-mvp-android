import assert from "node:assert/strict";
import test from "node:test";
import {
  MIN_SUPPORTED_APP_VERSION,
  RECOMMENDED_APP_VERSION,
  compareVersions,
  requestAppVersion,
  updateLevelFor,
} from "./appVersion.ts";

test("versions compare by number, not by text", () => {
  // "2.9" reads as later than "2.10" to a string comparison, and the day that
  // matters is the day a version rolls over.
  assert.equal(compareVersions("2.10", "2.9"), 1);
  assert.equal(compareVersions("2.49", "2.49.0"), 0, "a missing part is a zero");
  assert.equal(compareVersions("2.48.0", "2.49"), -1);
  assert.equal(compareVersions("3.0", "2.99"), 1);
});

test("junk compares as nothing rather than throwing", () => {
  // The version arrives in a header, so it is whatever a caller chose to send.
  assert.equal(compareVersions("", ""), 0);
  assert.equal(compareVersions("banana", "0.0"), 0);
  assert.equal(compareVersions("2.x", "2.0"), 0);
});

test("a current build is not nagged", () => {
  assert.equal(updateLevelFor(RECOMMENDED_APP_VERSION), "none");
  assert.equal(updateLevelFor("99.0"), "none");
});

test("an older build is asked, and a broken one is stopped", () => {
  assert.equal(updateLevelFor(MIN_SUPPORTED_APP_VERSION), "available");
  assert.equal(updateLevelFor("2.0"), "required");
});

test("the two levers stay in the order that makes them mean anything", () => {
  // Required must be the older of the two, or every build below the banner
  // would be locked out instead of asked.
  assert.ok(
    compareVersions(MIN_SUPPORTED_APP_VERSION, RECOMMENDED_APP_VERSION) <= 0,
    "MIN_SUPPORTED is above RECOMMENDED, which locks out builds that were only meant to be nudged",
  );
});

test("a build too old to name itself is asked, never stopped", () => {
  // It cannot read the answer either way, so requiring something of it would
  // only take the app away with no way to say why.
  assert.equal(updateLevelFor("unknown"), "available");
  assert.equal(updateLevelFor(""), "available");
});

test("the version is read from the header the app actually sends", () => {
  const headers = new Headers({ "x-app-version": " 2.49.0 " });
  assert.equal(requestAppVersion(headers), "2.49.0");
  assert.equal(requestAppVersion(new Headers()), "unknown");
});
