const buildFirefoxDriver = require("./drivers/driverSetup");
const { listAction } = require("./actions/listAction");
const { removeListingAction } = require("./actions/removeListingAction");

async function executeActions() {
  const profilePath =
    "/Users/whoisrosea/Library/Application Support/Firefox/Profiles/78yboywm.default-release";

  const driver = buildFirefoxDriver(profilePath);

  try {
    await listAction(driver);
    driver.sleep(300000);
    await removeListingAction(driver);
  } catch (error) {
    console.error("Error during navigation:", error);
  } finally {
    await driver.quit();
  }
}

function main() {
  executeActions();

  const interval = (3 * 60 + 15) * 60 * 1000;
  
  setInterval(() => {
    executeActions();
  }, interval);
}

main();
