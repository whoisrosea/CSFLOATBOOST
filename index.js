const axios = require("axios");
const cron = require("node-cron");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

let users = [
  {
    name: "Ilya",
    apikey: "CXhSmYc1ttBFLXOGBTHnxOFNdU0WkRZy",
    steamID: "76561198881086012",
    lastItemCreatedAt: null,
    timer: 0,
  },
  {
    name: "andrey_belskyy",
    apikey: "TqkXBKPQk_1qfDCiao414WsxsqYbv2nL",
    steamID: "76561198907322479",
    lastItemCreatedAt: null,
    timer: 30000,
  },
  {
    name: "vlad_chinyaev",
    apikey: "VliITsIqJz6cqGM0SZnlh4qGia96zT8T",
    steamID: "76561198813710478",
    lastItemCreatedAt: null,
    timer: 30000,
  },
];

const relistItems = async (user) => {
  const { apikey, steamID, timer } = user;

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
    console.log(
      `Данные получены для пользователя ${user.name}:`,
      stallResponse.data
    );

    const itemsList = stallResponse.data.data;

    for (let i = 0; i < itemsList.length; i++) {
      const item = itemsList[i];
      const assetID = item.item.asset_id;
      const itemID = item.id;
      const price = item.price;

      const itemCreatedAt = new Date(item.created_at);
      const currentTime = new Date();
      const diffMs = currentTime - itemCreatedAt;
      if (diffMs < 3 * 60 * 60 * 1000) {
        console.log(
          `Вещь ${itemID} у пользователя ${user.name} не выждала 3 часа`
        );
        continue;
      }

      const postData = {
        asset_id: assetID,
        price: price,
        type: "buy_now",
      };

      const deleteListingUrlFull = `${deleteListinglUrl}${itemID}`;

      if (timer > 0) {
        await sleep(timer); // Задержка перед следующим листингом
      }

      try {
        await axios.delete(deleteListingUrlFull, config);
        console.log(
          `Listing deleted for item ID: ${itemID} у пользователя ${user.name}`
        );
      } catch (error) {
        console.error(
          `Ошибка при удалении листинга у пользователя ${user.name}:`,
          error
        );
        continue; // Пропускаем и идем к следующему элементу
      }

      try {
        const postResponse = await axios.post(postListingUrl, postData, config);
        console.log(
          `Ответ сервера на новый листинг у пользователя ${user.name}:`,
          postResponse.data
        );
      } catch (error) {
        console.error(
          `Ошибка при создании нового листинга у пользователя ${user.name}:`,
          error
        );
      }
    }

    // Обновляем время создания последнего предмета
    if (itemsList.length > 0) {
      user.lastItemCreatedAt = itemsList[itemsList.length - 1].created_at;
    }
  } catch (error) {
    console.error(
      `Ошибка при получении данных стойки у пользователя ${user.name}:`,
      error
    );
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startCronJob = () => {
  for (const user of users) {
    console.log(`Выполнение задачи для пользователя ${user.name}`);
    relistItems(user);
  }
  for (const user of users) {
    const createdAt = new Date(user.lastItemCreatedAt || user.created_at);
    const now = new Date();

    const diffMs = createdAt.getTime() + 3 * 60 * 60 * 1000 - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const cronExpression = `0 */${diffHours} * * *`;

    console.log(
      `Запуск задачи для пользователя ${user.name} через ${diffHours} часов`
    );

    cron.schedule(cronExpression, () => {
      console.log(`Выполнение задачи для пользователя ${user.name}`);
      relistItems(user);
    });
  }
};

startCronJob();

// Для предотвращения выхода приложения
app.get("/", (req, res) => {
  res.send("Cron job is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
