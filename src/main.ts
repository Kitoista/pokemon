import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { PokeModule } from './app/poke.module';


platformBrowserDynamic().bootstrapModule(PokeModule)
  .catch(err => console.error(err));
