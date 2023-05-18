import React, { useEffect, useRef, useState } from 'react'
import { AlphaCard, Bleed, Box, Page, Text, ContextualSaveBar, Grid, LegacyCard, Thumbnail, Link, Button, Heading, Badge } from '@shopify/polaris';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import priceFormat from '../../utils/priceFormat';

interface orderData {
    addressShiping: string
    createdAt: string
    id: number
    methodPayment: string
    note: string
    products: {
        description: string,
        id: number,
        image: string,
        name: string,
        regularPrice: string,
        salePrice: string,
        variants:{
            id: number,
            price: number[],
            title: string,
            value: string[]
        }[]
    }[]
    quantityPerProduct: {
        productId: number,
        quantity: number
    }[],
    statusOrder: string,
    statusPayment: string,
    totalPrice: number,
    totalPricePerProduct: {
        productId: number,
        totalPrice: number
    }[]
    updatedAt: string
    userName : string
    variant: {
        productId: number,
        variantInfo: {
            id: number[],
            index: number[]
        }
    }[]
}

interface orderResponse {
    data: {
        success: boolean,
        data: orderData[],
        error: {
            fied: string,
            message: string
        },
        message: string
    }
}

interface User{
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
}

interface UserRes{
    data: {
        success: boolean,
        data: User,
        error: {
            fied: string,
            message: string
        },
        message: string
    }
}

const CustomerDetail = () => {
    const location = useLocation()
    const urlSplit =  location.pathname.split("/");
    const id = urlSplit[urlSplit.length - 1];
    const [order, setOrder] = useState<orderData[] | []>([]);
    const [user, setUser] = useState<User | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() =>{
        const fetchOrder = async () =>{
            const response = await axios.get<any, orderResponse>(`http://localhost:4000/api/order/get-order-by-customer?id=${id}`)
            const user = await axios.get<any, UserRes>(`http://localhost:4000/api/user/get-user-by-id?id=${id}`)
            if(response.data.success){
                setOrder(response.data.data);
            }
            if(user.data.success){
                setUser(user.data.data);
            }
        }
        fetchOrder()
    },[])

    return (
        <Page>
            <Grid>
                <Grid.Cell columnSpan={{ xl:7, xs: 6}}>
                    <LegacyCard 
                        title="Đơn hàng gần đây nhất"
                        primaryFooterAction={{
                            content: showAll ? "Ẩn đơn hàng" : "xem tất cả đơn hàng",
                            onAction: () =>{setShowAll(pre => !pre)},
                        }}
                    >
                        <LegacyCard.Section>
                        {
                            order.length > 0 && !showAll && order[0].products.map((product) =>(
                                    <div 
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "20px"
                                        }} 
                                        key={product.id}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }} 
                                        >
                                            <Thumbnail source={product.image} alt={product.name} size='large'/>
                                            <span style={{
                                                marginLeft: '20px'
                                            }}>
                                                <Link url={`/product/${product.id}`}>
                                                    {product.name}
                                                </Link>
                                                {
                                                    order[0].variant.map((variantProduct) =>(
                                                        variantProduct.productId == product.id ? variantProduct.variantInfo.id.map((variant, index) =>(
                                                            product.variants.map((item) =>{
                                                                if(item.id === variant){
                                                                    return (
                                                                        <Box key={item.id}>{item.title}: {item.value[variantProduct.variantInfo.index[index]]}</Box> 
                                                                    )
                                                                }
                                                            })
                                                        )) : ""
                                                    ))
                                                }
                                            </span>
                                            
                                        </div>
                                        <div>
                                            {
                                                order[0].totalPricePerProduct.map((item, index) =>(
                                                    item.productId === product.id ? `${priceFormat.format(item.totalPrice)} x ${order[0].quantityPerProduct[index].quantity}` : ""
                                                ))
                                            }
                                        </div>
                                        <div>
                                            {
                                                order[0].totalPricePerProduct.map((item, index) =>(
                                                    item.productId === product.id ? priceFormat.format(item.totalPrice * order[0].quantityPerProduct[index].quantity) : ""
                                                ))
                                            }
                                        </div>
                                    </div>
                                 
                                ))
                            }
                        </LegacyCard.Section>  
                            { order.length > 0 && showAll && 
                                    order.map((order) =>(
                                        <LegacyCard.Section>
                                            {
                                        order.products.map((product) =>(
                                        <div 
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "20px"
                                        }} 
                                        key={product.id}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }} 
                                        >
                                            <Thumbnail source={product.image} alt={product.name} size='large'/>
                                            <span style={{
                                                marginLeft: '20px'
                                            }}>
                                                <Link url={`/product/${product.id}`}>
                                                    {product.name}
                                                </Link>
                                                {
                                                    order.variant.map((variantProduct) =>(
                                                        variantProduct.productId == product.id ? variantProduct.variantInfo.id.map((variant, index) =>(
                                                            product.variants.map((item) =>{
                                                                if(item.id === variant){
                                                                    return (
                                                                        <Box key={item.id}>{item.title}: {item.value[variantProduct.variantInfo.index[index]]}</Box> 
                                                                    )
                                                                }
                                                            })
                                                        )) : ""
                                                    ))
                                                }
                                            </span>
                                            
                                        </div>
                                        <div>
                                            {
                                                order.totalPricePerProduct.map((item, index) =>(
                                                    item.productId === product.id ? `${priceFormat.format(item.totalPrice)} x ${order.quantityPerProduct[index].quantity}` : ""
                                                ))
                                            }
                                        </div>
                                        <div>
                                            {
                                                order.totalPricePerProduct.map((item, index) =>(
                                                    item.productId === product.id ? priceFormat.format(item.totalPrice * order.quantityPerProduct[index].quantity) : ""
                                                ))
                                            }
                                        </div>
                                    </div>
                                    ))
                                    }
                                    </LegacyCard.Section>
                                ))
                            }
                    </LegacyCard>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xl: 5, xs: 6 }}>
                    <LegacyCard title="Thông tin khách hàng" >
                        {
                            user && (
                                <>
                                <LegacyCard.Section>
                                {(user !== null) && (user.firstName + " " + user.lastName)}
                                </LegacyCard.Section>
                                <LegacyCard.Section title="Thông tin liên lạc">
                                    <p>{
                                        user !== null ? user.email : "không có email"
                                    }</p>
                                    <p>{
                                        user !== null ? user.phoneNumber : "không có SĐT"
                                    }</p>
                                </LegacyCard.Section>
                                </>
                            )

                        }
                        
                    </LegacyCard>
                    <LegacyCard title="Ghi chú">
                    {
                        order.length > 0 && (
                            <LegacyCard.Section>
                                {order[0].note || <p>không có ghi chú</p>}
                            </LegacyCard.Section>
                        )
                    }
                    </LegacyCard>
                </Grid.Cell>
            </Grid>
            
        </Page>
    )
}

export default CustomerDetail