import "./global.css"
import "./assets/global.css";
import '@shopify/polaris/build/esm/styles.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import Register from "./register/Register";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublishedRoute from "./utils/publishedRoute";
import Product from "./components/dashboard/product/Index";
import Order from "./components/dashboard/Order";
import Drafts from "./components/dashboard/Drafts";
import Create from "./components/dashboard/product/Create";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route
                path="/admin"
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
                <Route path="drafts" element={<Drafts />} />
            </Route>
            <Route
                path="admin/login"
                element={
                    <PublishedRoute>
                        <Login />
                    </PublishedRoute>
                }
            />
            <Route
                path="admin/register"
                element={
                    <PublishedRoute>
                        <Register />
                    </PublishedRoute>
                }
            />
        </Routes>
    </BrowserRouter>
);

export default App;
