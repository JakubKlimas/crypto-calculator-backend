# Crypto Calculator Backend

The **Crypto Calculator Backend** is the backend service for the Crypto Calculator application. It provides APIs for managing wallets, tracking cryptocurrency assets, analyzing profit/loss, fetching real-time market data, and more.

This backend is built using **Node.js** and **Express** with TypeScript for scalability and maintainability.

---

## Features

### Wallet Management
- Create wallets (up to 3 wallets per user).
- Add and remove wallets.
- Retrieve all wallets and wallet details.

### Portfolio Management
- Add crypto assets to wallets, specifying details like price, amount, and market.
- Update or remove individual assets.
- Get a wallet's complete portfolio and calculate profit/loss.
- Fetch account balance by wallet ID.

### Crypto Information
- Retrieve detailed market data for specific cryptocurrencies by symbol or name.
- Fetch chart data for cryptocurrencies across multiple intervals (e.g., day, week, month).
- Get a list of the top 10 cryptocurrencies by market performance.

### Alternative APIs
- Retrieve the Fear and Greed Index to gauge market sentiment.

---

## API Routes

### Wallet Routes
| Method | Endpoint              | Description                                  |
|--------|-----------------------|----------------------------------------------|
| GET    | `/wallet`             | Retrieve all wallets.                        |
| POST   | `/wallet`             | Create a new wallet.                         |
| DELETE | `/wallet/:walletId`   | Remove a wallet by ID.                       |

### Portfolio Routes
| Method  | Endpoint                     | Description                                          |
|---------|------------------------------|------------------------------------------------------|
| GET     | `/portfolio/:walletId`       | Get portfolio details by wallet ID.                  |
| GET     | `/portfolio/account-balance/:walletId` | Get account balance by wallet ID.          |
| POST    | `/portfolio`                 | Add an asset to a wallet's portfolio.                |
| PUT     | `/portfolio/update-asset`    | Update an existing asset in a portfolio.             |
| DELETE  | `/portfolio/remove-asset`    | Remove an asset from a portfolio.                    |
| DELETE  | `/portfolio/remove-portfolio`| Remove all assets from a portfolio by wallet ID/name.|

### Crypto Information Routes
| Method | Endpoint                                | Description                                                  |
|--------|-----------------------------------------|--------------------------------------------------------------|
| GET    | `/crypto-info/chart/:symbol/:interval?` | Get chart data for a cryptocurrency by symbol and interval.  |
| GET    | `/crypto-info/data-symbol/:symbol`      | Get detailed market data for a cryptocurrency by symbol.     |
| GET    | `/crypto-info/data-symbols`             | Get data for multiple cryptocurrencies using query parameters|
| GET    | `/crypto-info/data-name/:name`          | Get market data for a cryptocurrency by name.                |
| GET    | `/crypto-info/top-10-coins`             | Fetch the top 10 cryptocurrencies by market performance.     |

### Alternative API Routes
| Method | Endpoint                | Description                               |
|--------|-------------------------|-------------------------------------------|
| GET    | `/alternative-api/fng`  | Retrieve the Fear and Greed Index data.   |

---

## Getting Started

### Prerequisites
- **Node.js** (v16+)
- **npm** or **yarn**
- A `.env` file with required environment variables. Here are required variables:
    ```json
        # PORT
        PORT = 3000

        # MONGO DATABASE VARIABLES
        DB_HOST
        DB_PASSWORD
        DB_CLUSTER
        DB_DATABASE

        # LOG
        LOG_FORMAT = dev
        LOG_DIR = ../logs

        # CORS
        ORIGIN = *
        CREDENTIALS = true

        # COINGECKO
        COINGECKO_API_KEY
    ```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/crypto-calculator-backend.git
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create .env file and pass requiored  variables  (see prerequisites section)
4. Run command:
    ```bash
    npm run dev
    ```
5. Enjoy!

### Future Improvements
- Add user authentication for secure wallet access.
- Support additional markets and external APIs.
- Enhance error handling and logging.