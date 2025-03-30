// server.js
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

const regionsDict = {
  1: "АР Крим",
  2: "Вінницька",
  3: "Волинська",
  4: "Дніпропетровська",
  5: "Донецька",
  6: "Житомирська",
  7: "Закарпатська",
  8: "Запорізька",
  9: "Івано-Франківська",
  10: "Київська",
  11: "Кіровоградська",
  12: "Луганська",
  13: "Львівська",
  14: "Миколаївська",
  15: "Одеська",
  16: "Полтавська",
  17: "Рівненська",
  18: "Сумська",
  19: "Тернопільська",
  20: "Харківська",
  21: "Херсонська",
  22: "Хмельницька",
  23: "Черкаська",
  24: "Чернівецька",
  25: "Чернігівська",
  26: "м. Київ",
};

app.use(cors());
app.use(express.json());

// Додаємо простий тестовий маршрут
app.post('/check', async (req, res) => {
  console.log('Received body:', req.body);
  const { plate } = req.body;
  if (!plate) return res.status(400).json({ error: 'Plate number required' });

  const browser = await puppeteer.launch({ headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  const page = await browser.newPage();

  await page.goto('https://opendata.hsc.gov.ua/check-leisure-license-plates/', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  let results = [];

  for (let i = 1; i <= 26; i++) {
    // Wait for the region selector to be available
    await page.waitForSelector("select#region", { timeout: 10000 });

    await page.select("select#region", i.toString());
    await page.select("select#type_venichle", "light_car_and_truck");

    await page.click("input#number", { clickCount: 3 });
    await page.keyboard.press("Backspace");

    await page.type("input#number", plate);
    await page.click('input[type="submit"][value="ПЕРЕГЛЯНУТИ"]');

    await page.waitForSelector("#exampleTable td:first-child", { timeout: 60000 });

    try {
      const result = await page.$eval("#exampleTable td:first-child", el => el.textContent.trim());
      if (result.includes(plate)) {
        results.push({ region: regionsDict[i], status: "available", message: `Номер ${plate} доступний` });
      } else {
        results.push({ region: regionsDict[i], status: "unavailable", message: `Номер ${plate} НЕ доступний` });
      }
    } catch (error) {
      await browser.close();
      console.error('Selector "#exampleTable td:first-child" not found:', error);
      return res.status(500).json({ error: 'Table did not load in time.' });
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    await page.goBack();
  }

  await browser.close();
  res.json(results);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));