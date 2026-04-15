import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { ComparisonHistoryRoutes } from '../modules/ComparisonHistory/comparisonHistory.routes';
import { PaymentRoutes } from '../modules/Payment/payment.routes';
import { PageRoutes } from '../modules/Page/page.route';
import { ContactRoutes } from '../modules/Contact/contact.routes';
import { HeroSectionRoutes } from '../modules/Storefront/HeroSection/heroSection.routes';
import { BrandRoutes } from '../modules/Storefront/Brand/brand.routes';
import { CategoryRoutes } from '../modules/Storefront/Category/category.routes';
import { ProductRoutes } from '../modules/Storefront/Product/product.routes';

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
        path: '/payments',
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
        path: '/storefront',
        route: HeroSectionRoutes,
    },
    {
        path: '/storefront',
        route: BrandRoutes,
    },
    {
        path: '/storefront',
        route: CategoryRoutes,
    },
    {
        path: '/storefront',
        route: ProductRoutes,
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
