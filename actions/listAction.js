async function listAction(driver) {
  await driver.get("https://csfloat.com/sell");
  await driver.sleep(5000);
  await findCardAndClickButton(driver);
  await clickOpenerButton(driver);
}
