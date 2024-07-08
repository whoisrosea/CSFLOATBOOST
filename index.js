const axios = require("axios");

const keys = [
  {
    name: "Ilya",
    apikey: "CXhSmYc1ttBFLXOGBTHnxOFNdU0WkRZy",
    steamID: "76561198881086012",
    timer: false,
  },
  {
    name: "andrey_belskyy",
    apikey: "TqkXBKPQk_1qfDCiao414WsxsqYbv2nL",
    steamID: "76561198907322479",
    timer: true,
  },
  {
    name: "vlad_chinyaev",
    apikey: "VliITsIqJz6cqGM0SZnlh4qGia96zT8T",
    steamID: "76561198813710478",
    timer: true,
  },
  {
    name: "ilusha", // ( 5 days )
    apikey: "ZBrBwocM9Flu-lw6JpdgImDOfzmULioJ",
    steamID: "76561199082819227",
    timer: true,
  },
  {
    name: "maxim_blohin", // ( 2 days )
    apikey: "Cx_RRfHU3hLcBO3vn4AA2zDpdxbOnfJb",
    steamID: "76561199493367613",
    timer: true,
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const relistItems = async (apikey, steamID, timer) => {
  const getStallUrl = `https://csfloat.com/api/v1/users/${steamID}/stall`;
  const deleteListinglUrl = `https://csfloat.com/api/v1/listings/`;
  const postListingUrl = "https://csfloat.com/api/v1/listings/";
  const config = {
    headers: {
      Authorization: apikey,
    },
  };

  try {
    const stallResponse = await axios.get(getStallUrl, config);
    console.log("Данные получены:", stallResponse.data);

    const itemsList = stallResponse.data.data;

    for (let i = 0; i < itemsList.length; i++) {
      const item = itemsList[i];
      const assetID = item.item.asset_id;
      const itemID = item.id;
      const price = item.price;

      const postData = {
        asset_id: assetID,
        price: price,
        type: "buy_now",
      };

      const deleteListingUrlFull = `${deleteListinglUrl}${itemID}`;

      if (timer) {
        await sleep(i * 30000); // Добавляем задержку
      }

      try {
        await axios.delete(deleteListingUrlFull, config);
        console.log("Listing deleted for item ID:", itemID);
      } catch (error) {
        console.error("Ошибка при удалении листинга:", error);
        continue; // Пропускаем и идем к следующему элементу
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

for (const key of keys) {
  relistItems(key.apikey, key.steamID, key.timer);
}

for (const key of keys) {
  relistItems(key.apikey, key.steamID, key.timer);
}
