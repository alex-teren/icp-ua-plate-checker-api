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
  const { plate, region } = req.body;
  if (!plate || !region) {
    return res.status(400).json({ error: 'Plate number and region required' });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://opendata.hsc.gov.ua/check-leisure-license-plates/', {
      waitUntil: 'networkidle2',
      timeout: 15000
    });

    await page.waitForSelector('select#region', { timeout: 10000 });

    await page.select('select#region', region.toString());
    await page.select('select#type_venichle', 'light_car_and_truck');

    await page.click('input#number', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('input#number', plate);
    await page.click('input[type="submit"][value="ПЕРЕГЛЯНУТИ"]');

    await page.waitForSelector('#exampleTable td:first-child', { timeout: 15000 });
    const result = await page.$eval("#exampleTable td:first-child", el => el.textContent.trim());

    await browser.close();

    res.json({ region, result });
  } catch (error) {
    console.error(error);
    await browser.close();
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));