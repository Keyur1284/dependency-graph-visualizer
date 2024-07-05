import * as mod from './b.android';

export const a = (async () => {

    let myImportedModule = await import('./b.android');
    // let myImportedModule2 = await require('./c.ios');
  
    // myImportedModule.myFunction1();
    // myImportedModule.myFunction2();
  
  })();

export {mod};