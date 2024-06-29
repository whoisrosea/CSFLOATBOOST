const { Builder } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

function buildFirefoxDriver(profilePath) {
  const options = new firefox.Options();
  options.setProfile(profilePath);
  return new Builder().forBrowser("firefox").setFirefoxOptions(options).build();
}

module.exports = { buildFirefoxDriver };
