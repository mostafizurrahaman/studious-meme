import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { ComparisonHistoryRoutes } from '../modules/ComparisonHistory/comparisonHistory.routes';
import { PaymentRoutes } from '../modules/Payment/payment.routes';
import { PageRoutes } from '../modules/Page/page.route';
import { ContactRoutes } from '../modules/Contact/contact.routes';
import { HeroSectionRoutes } from '../modules/HeroSection/heroSection.routes';
import { BrandRoutes } from '../modules/Brand/brand.routes';
import { CategoryRoutes } from '../modules/Category/category.routes';
import { ProductRoutes } from '../modules/Product/product.routes';
import { OrderRoutes } from '../modules/Order/order.routes';

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
        path: '/payment',
        route: PaymentRoutes,
    },
    {
        path: '/comparison-history',
        route: ComparisonHistoryRoutes,
    },
    {
        path: '/contact',
        route: ContactRoutes,
    },
    {
        path: '/hero',
        route: HeroSectionRoutes,
    },
    {
        path: '/brand',
        route: BrandRoutes,
    },
    {
        path: '/category',
        route: CategoryRoutes,
    },
    {
        path: '/product',
        route: ProductRoutes,
    },
    {
        path: '/order',
        route: OrderRoutes,
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
