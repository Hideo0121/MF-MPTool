import { route as ziggyRoute } from 'ziggy-js';

declare global {
    interface Window {
        Ziggy: any;
        route: typeof ziggyRoute;
    }

    var route: typeof ziggyRoute;
}

export {};
