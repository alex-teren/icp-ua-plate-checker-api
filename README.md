# 🇺🇦 ICP UA Plate Checker API (Backend)

A backend API service built with Node.js, Express, and Puppeteer to check the availability of Ukrainian vehicle license plates. The API is deployed on Heroku and designed to work seamlessly with the frontend hosted on ICP.

## 🚀 Features

- ✅ RESTful API built using Express.js
- ✅ Automated checks using Puppeteer
- ✅ Deployed on Heroku (EU region recommended)
- ✅ JSON responses for easy frontend integration

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **Puppeteer**
- **Heroku**

## 📦 Installation and Local Development

Clone the repository:

```bash
git clone https://github.com/alex-teren/icp-ua-plate-checker-api.git
cd icp-ua-plate-checker-api
npm install
```

Start the local server:

```bash
npm start
```

The server runs at:

```
http://localhost:3000
```

## 📖 API Usage

### Check Plate Availability:

- **Endpoint:** `/check`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Example:**

```json
{
  "plate": "1337"
}
```

**Response Example:**

```json
{
  "success": true,
  "region": "Київська",
  "available": true
}
```

## 🔗 Frontend Application

Frontend React application integrated with ICP:

👉 [icp-ua-plate-checker](https://github.com/alex-teren/icp-ua-plate-checker)

## 📄 License

[MIT](LICENSE)
