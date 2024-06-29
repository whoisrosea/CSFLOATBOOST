const axios = require("axios");

const apikey = "CXhSmYc1ttBFLXOGBTHnxOFNdU0WkRZy";
const steamID = "76561198881086012";

const config = {
  headers: {
    Authorization: apikey,
  },
};

const getStallUrl = `https://csfloat.com/api/v1/users/${steamID}/stall`;
const deleteListinglUrl = `https://csfloat.com/api/v1/listings/`;
const postListingUrl = "https://csfloat.com/api/v1/listings/";

const relistItems = async () => {
  try {
    const stallResponse = await axios.get(getStallUrl, config);
    console.log("Данные получены:", stallResponse.data);

    const itemsList = stallResponse.data.data;

    for (const item of itemsList) {
      const assetID = item.item.asset_id;
      const itemID = item.id;
      const price = item.price;

      const postData = {
        asset_id: assetID,
        price: price,
        type: "buy_now",
      };

      const deleteListingUrlFull = `${deleteListinglUrl}${itemID}`;

      try {
        await axios.delete(deleteListingUrlFull, config);
        console.log("Listing deleted for item ID:", itemID);
      } catch (error) {
        console.error("Ошибка при удалении листинга:", error);
        continue;
      }

      try {
        const postResponse = await axios.post(postListingUrl, postData, config);
        console.log("Ответ сервера на новый листинг:", postResponse.data);
      } catch (error) {
        console.error("Ошибка при создании нового листинга:", error);
      }
    }
  } catch (error) {
    console.error("Ошибка при получении данных стойки:", error);
  }
};

relistItems();

// const runInterval = 3 * 3600 * 1000 + 5 * 60 * 1000; // 3 hours and 5 minutes in milliseconds

// const scheduleRelistItems = () => {
//   relistItems()
//     .then(() => {
//       console.log("relistItems completed, scheduling next run...");
//       setTimeout(scheduleRelistItems, runInterval);
//     })
//     .catch((error) => {
//       console.error("Error running relistItems:", error);
//       console.log("Scheduling next attempt...");
//       setTimeout(scheduleRelistItems, runInterval);
//     });
// };

// scheduleRelistItems();
