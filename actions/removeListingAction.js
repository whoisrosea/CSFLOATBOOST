const { By } = require("selenium-webdriver");

async function findCardAndClickButton(driver) {
  const cards = await driver.findElements(By.css("item-card"));
  for (let card of cards) {
    const text = await card.getText();
    if (text.includes("0.226674690843")) {
      const button = await card.findElement(
        By.css(
          ".mdc-button.mdc-button--raised.mat-mdc-raised-button.mat-primary"
        )
      );
      await button.click();
      console.log("Button has been clicked in the correct card.");
      break;
    }
  }
}

async function clickOpenerButton(driver) {
  const openerButton = await driver.findElement(
    By.css(
      ".opener.mdc-button.mdc-button--raised.mat-mdc-raised-button.mat-primary.mat-mdc-button-base"
    )
  );
  await openerButton.click();
  console.log("Opener button has been clicked.");

  await driver.sleep(1000); // Adjust timing based on actual behavior

  const inputField = await driver.findElement(By.id("mat-input-1"));
  await inputField.clear(); // Clear any pre-existing value in the input field
  await inputField.sendKeys("7.77");
  console.log("Input value 7.77 has been entered.");

  const sellItemsButton = await driver.findElement(
    By.css(
      ".container[_ngcontent-ng-c126959779] .actions[_ngcontent-ng-c126959779] button[_ngcontent-ng-c126959779]"
    )
  );
  await sellItemsButton.click();
  console.log("Sell items button has been clicked.");

  const anotherButton = await driver.findElement(
    By.css(
      ".wrapper[_ngcontent-ng-c3184246400] .buttons[_ngcontent-ng-c3184246400] button[_ngcontent-ng-c3184246400]"
    )
  );
  await anotherButton.click();
  console.log("Another button has been clicked.");
}

async function removeListingAction(driver) {
  await driver.get("https://csfloat.com/stall/me");
  await driver.sleep(5000);

  const openUnlistMenu = await driver.findElement(
    By.css('button[mattooltip="Edit Listing"]')
  );
  await openUnlistMenu.click();
  await driver.sleep(2000);

  const removeListingButton = await driver.findElement(
    By.xpath("//button[contains(., 'Remove Listing')]")
  );
  await removeListingButton.click();
}

module.exports = {
  removeListingAction,
  findCardAndClickButton,
  clickOpenerButton,
};
