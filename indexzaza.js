const { buildFirefoxDriver } = require("./drivers/driverSetup");
const { By } = require("selenium-webdriver");
const { listAction } = require("./actions/listAction");
const { removeListingAction } = require("./actions/removeListingAction");

async function executeActions() {
  const profilePath =
    "/Users/whoisrosea/Library/Application Support/Firefox/Profiles/78yboywm.default-release";

  const driver = buildFirefoxDriver(profilePath);
  await cardsLoop(driver);
  try {
  } catch (error) {
    console.error("Error during navigation:", error);
  } finally {
    await driver.quit();
  }
}

async function cardsLoop(driver) {
  await driver.get("https://csfloat.com/stall/me");
  await driver.sleep(5000);
  const cards = await driver.findElements(By.css("item-card"));
  for (let card of cards) {
    const floatElement = await card.findElement(
      By.css(
        ".container[_ngcontent-ng-c816232439] .text-info[_ngcontent-ng-c816232439] .wear[_ngcontent-ng-c816232439]"
      )
    );
    const float = await floatElement.getText();
    const priceElement = await card.findElement(
      By.css(
        ".item-grid[_ngcontent-ng-c150678820] .footer[_ngcontent-ng-c150678820] .price-row[_ngcontent-ng-c150678820] .price[_ngcontent-ng-c150678820]"
      )
    );
    const price = await priceElement.getText();
    const adjustedPrice = price.slice(1);
    console.log(float);
    console.log(adjustedPrice);

    const openUnlistMenu = await card.findElement(
      By.css('button[mattooltip="Edit Listing"]')
    );
    await openUnlistMenu.click();
    await driver.sleep(2000);

    // Click on the 'Remove Listing' button
    const removeListingButton = await driver.findElement(
      By.xpath("//button[contains(., 'Remove Listing')]")
    );
    await removeListingButton.click();
    await driver.sleep(2000);

    driver.sleep(30000);
    await listAction(driver, float, adjustedPrice);
    driver.sleep(30000);
  }
}

function main() {
  executeActions();
  const interval = (3 * 60 + 15) * 60 * 1000;

  setInterval(() => {
    executeActions();
    console.log("executed");
  }, interval);
}

main();
