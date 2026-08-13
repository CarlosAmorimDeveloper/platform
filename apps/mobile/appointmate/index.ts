import { registerRootComponent } from 'expo';

import App from './App';

// Ensures the app boots correctly whether loaded in Expo Go or in a native build.
registerRootComponent(App);
