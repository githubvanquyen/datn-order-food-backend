import "./global.css"
import "./assets/global.css";
import '@shopify/polaris/build/esm/styles.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublishedRoute from "./utils/publishedRoute";
import Product from "./components/dashboard/product/Index";
import Flashsale from "./components/dashboard/Flashsale/Index";
import CreateFls from "./components/dashboard/Flashsale/Create";
import CreateCollection from "./components/dashboard/Collection/Create";
import Collection from "./components/dashboard/Collection/Index";
import Blog from "./components/dashboard/Blog/Index";
import CreateBlog from "./components/dashboard/Blog/Create";
import Discount from "./components/dashboard/Discount/Index";
import Analysis from "./components/dashboard/Analysis/Index";
import CreateDiscount from "./components/dashboard/Discount/Create";
import Order from "./components/dashboard/Order";
import Customer from "./components/dashboard/Customer";
import Create from "./components/dashboard/product/Create";
import OrderDetail from "./components/dashboard/OrderDetail";
import CustomerDetail from "./components/dashboard/CustomerDetail";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            >
                <Route path="product" element={<Product/>}/>
                <Route path="product/create" element={<Create />} />
                <Route path="product/:id" element={<Create />} />
                <Route path="order" element={<Order />} />
                <Route path="order/:id" element={<OrderDetail />} />
                <Route path="customer" element={<Customer />} />
                <Route path="customer/:id" element={<CustomerDetail />} />
                <Route path="discount" element={<Discount />} />
                <Route path="discount/:id" element={<CreateDiscount />} />
                <Route path="flashsale" element={<Flashsale />} />
                <Route path="collection" element={<Collection />} />
                <Route path="flashsale/:id" element={<CreateFls />} />
                <Route path="collection/:id" element={<CreateCollection />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<CreateBlog />} />
            </Route>
            <Route
                path="/login"
                element={
                    <PublishedRoute>
                        <Login />
                    </PublishedRoute>
                }
            />
        </Routes>
    </BrowserRouter>
);

export default App;
