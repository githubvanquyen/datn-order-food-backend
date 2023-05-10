import React , {useCallback, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductsMinor, OrdersMinor, CollectionReferenceMinor, AnalyticsMinor, CustomersMinor, DiscountsMinor, CashDollarMinor } from '@shopify/polaris-icons';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Frame, TopBar, Navigation} from '@shopify/polaris';

interface LayoutProps{
    children: JSX.Element
}

const Layout = ({children}: LayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

    const checkIsSelected = (path: string) => {
        return (location.pathname.split("/").includes(path));
    };

    const theme = {
        colors: {
            topBar: {
                background: '#357997',
            },
        },
        logo: {
            width: 32,
            topBarSource: "http://127.0.0.1:5173/public/vite.svg",
            accessibilityLabel: 'Dashboard',
        },
    };

    const toggleMobileNavigationActive = useCallback(() =>
    setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive,), []);
    
    const navigationMarkup = (
        <Navigation location='/'>
            <Navigation.Section
                items={[
                    {
                        label: "Sản phẩm",
                        icon: ProductsMinor,
                        selected: checkIsSelected("product"),
                        onClick: () =>{navigate("/product")}
                    },{
                        label: "Danh mục sản phẩm",
                        icon: CollectionReferenceMinor,
                        selected: checkIsSelected("collection"),
                        onClick: () =>{navigate("/collection")}
                    },{
                        label: "Khách hàng",
                        icon: CustomersMinor,
                        selected: checkIsSelected("customer"),
                        onClick: () =>{navigate("/customer")}
                    },{
                        label: "Đơn đặt hàng",
                        icon: OrdersMinor,
                        selected: checkIsSelected("order"),
                        onClick: () =>{navigate("/order")}
                    },{
                        label: "Khuyến mãi",
                        icon: DiscountsMinor,
                        selected: checkIsSelected("flashsale"),
                        onClick: () =>{navigate("/flashsale")}
                    },{
                        label: "Mã Giảm giá",
                        icon: CashDollarMinor,
                        selected: checkIsSelected("discount"),
                        onClick: () =>{navigate("/discount")}
                    },{
                        label: "Thống kê",
                        icon: AnalyticsMinor,
                        selected: checkIsSelected("analysis"),
                        onClick: () =>{navigate("/analysis")}
                    }

                ]}
            />
        </Navigation>
    );
  return (
    <AppProvider 
        i18n={enTranslations}
    >
        <Frame
            topBar={<TopBar showNavigationToggle />}
            navigation={navigationMarkup}
            showMobileNavigation={mobileNavigationActive}
            onNavigationDismiss={toggleMobileNavigationActive}
            logo={theme.logo}

        >
            {children}                       
        </Frame>
  </AppProvider>
  )
}

export default Layout