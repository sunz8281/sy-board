import LeftSidebar from "@comp/common/AppLayout/LeftSidebar/LeftSidebar";
import Header from "@comp/common/AppLayout/Header/Header";
import RightSidebar from "./RightSidebar/RightSidebar";

interface AppLayoutProps {
    children: React.ReactNode;
    header?: boolean;
    leftSidebar?: boolean;
    rightSidebar?: boolean;
    activeCategory?: number;
}

export const AppLayout = ({
    children,
    header = false,
    leftSidebar = false,
    rightSidebar = false,
    activeCategory,
}: AppLayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen">
            {header && <Header />}
            <div className="flex flex-1 mx-auto w-full max-w-[1440px] gap-8 px-8 py-8">
                {leftSidebar && (
                    <LeftSidebar activeCategory={activeCategory}/>
                )}
                <main className="flex-1">{children}</main>
                {rightSidebar && (
                    <RightSidebar/>
                )}
            </div>
        </div>
    );
}