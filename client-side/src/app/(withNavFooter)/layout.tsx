import { FloatingCategoryRail } from '@/components/FloatingCategoryRail';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MobileToolbar } from '@/components/MobileToolbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            <FloatingCategoryRail />
            <div className="min-h-screen">{children}</div>
            <Footer />
            <MobileToolbar />
        </div>
    );
};

export default MainLayout;
