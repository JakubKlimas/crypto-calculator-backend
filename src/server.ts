import { App } from '@/app';
import { CryptoInfoRoute } from './routes/crypto-info.route';
import { ValidateEnv } from '@utils/validateEnv';
import { WalletRoute } from './routes/wallet.route';
import { PortfolioRoute } from './routes/portfolio.route';
import { AlternativeApiRoute } from './routes/alternative-api.route';

ValidateEnv();

const app = new App([new CryptoInfoRoute(), new WalletRoute(), new PortfolioRoute(), new AlternativeApiRoute()]);

app.listen();
