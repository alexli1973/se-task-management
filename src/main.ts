import { bootstrapApplication } from '@angular/platform-browser';
import localeHe from '@angular/common/locales/he';
import {registerLocaleData} from '@angular/common';

import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localeHe);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
