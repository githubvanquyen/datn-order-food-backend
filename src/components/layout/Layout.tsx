import React , {useCallback, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductsMinor, OrdersMinor, DraftOrdersMajor } from '@shopify/polaris-icons';
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
                        label: "Product",
                        icon: ProductsMinor,
                        selected: checkIsSelected("product"),
                        onClick: () =>{navigate("/admin/product")}
                    },{
                        label: "Order",
                        icon: OrdersMinor,
                        selected: checkIsSelected("order"),
                        onClick: () =>{navigate("/admin/order")}
                    },{
                        label: "Drafts",
                        icon: DraftOrdersMajor,
                        selected: checkIsSelected("drafts"),
                        onClick: () =>{navigate("/admin/drafts")}
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