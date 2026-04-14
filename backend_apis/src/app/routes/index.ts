import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { PricingRoutes } from '../modules/Product/product.routes';
import { GroceryListRoutes } from '../modules/GroceryList/groceryList.routes';
import { ComparisonHistoryRoutes } from '../modules/ComparisonHistory/comparisonHistory.routes';
import { PaymentRoutes } from '../modules/Payment/payment.routes';
import { PageRoutes } from '../modules/Page/page.route';
import { ContactRoutes } from '../modules/Contact/contact.routes';

const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes,
    },
    {
        path: '/page',
        route: PageRoutes,
    },
    {
        path: '/admin',
        route: AdminRoutes,
    },
    {
        path: '/pricing',
        route: PricingRoutes,
    },
    {
        path: '/grocery-list',
        route: GroceryListRoutes,
    },
    {
        path: '/comparison-history',
        route: ComparisonHistoryRoutes,
    },
    {
        path: '/payments',
        route: PaymentRoutes,
    },
    {
        path: '/contact',
        route: ContactRoutes,
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
