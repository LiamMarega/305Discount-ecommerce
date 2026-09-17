import path from 'path';
import { bootstrap, DefaultJobQueuePlugin } from '@vendure/core';
import { populate } from '@vendure/core/cli';

import { config } from './vendure-config';
import { initialData } from './import/vendure-initial-data';

const productsCsvFile = path.join(__dirname, 'import/vendure-products.csv');

const populateConfig = {
  ...config,
  plugins: (config.plugins || []).filter(
    plugin => plugin !== DefaultJobQueuePlugin,
  ),
};

populate(
  () => bootstrap(populateConfig),
  initialData,
  productsCsvFile,
)
  .then(app => app.close())
  .then(
    () => process.exit(0),
    err => {
      console.error(err);
      process.exit(1);
    },
  );
