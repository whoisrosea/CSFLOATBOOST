const { By } = require("selenium-webdriver");

async function removeListingAction(driver) {
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
};
