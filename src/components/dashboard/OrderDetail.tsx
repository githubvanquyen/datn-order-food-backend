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
    user:{
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string
    }
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
        data: orderData,
        error: {
            fied: string,
            message: string
        },
        message: string
    }
}

const OrderDetail = () => {
    const location = useLocation()
    const urlSplit =  location.pathname.split("/");
    const id = urlSplit[urlSplit.length - 1];
    const [order, setOrder] = useState<orderData | null>(null);
    const [isUpdateOrder, setIsUpdateOrder] = useState(false);

    useEffect(() =>{
        const fetchOrder = async () =>{
            const response = await axios.get<any, orderResponse>(`http://localhost:4000/api/order/get-order-by-id?id=${id}`)
            if(response.data.success){
                setOrder(response.data.data);
            }
        }
        fetchOrder()
    },[isUpdateOrder])

    const handleChangeStatusOrder = async () =>{
        const fetchChangeOrder = await axios.put<any, orderResponse>("http://localhost:4000/api/order/update-status-order",{
            id: id,
            statusOrder: (order?.statusOrder === "-1") ? ("0") : ( order?.statusOrder === "0" ? ("1") : ("")),
        })
        if(fetchChangeOrder.data.success){
            setIsUpdateOrder(true);
        }
    }

    return (
        <Page>
            <Grid>
                <Grid.Cell columnSpan={{ xl:7, xs: 6}}>
                    <LegacyCard 
                        title="Thông tin chi tiết đơn hàng"
                        primaryFooterAction={{
                            content: (order?.statusOrder === "-1") ? ("Xác nhận đơn hàng") : ("Giao hàng thành công"),
                            onAction: () =>{handleChangeStatusOrder()},
                            disabled: order?.statusOrder === "1" ? true :false
                        }}
                    >
                        <LegacyCard.Section>
                            <p>{
                                (order?.statusOrder === "-1") ? (<Badge status='attention'>Đang chờ xác nhận</Badge>) : (
                                    order?.statusOrder === "0" ? (<Badge status='critical'>Đang giao hàng</Badge>) : (<Badge status='success'>Đã giao hàng</Badge>)
                                )
                            }</p>
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                        {
                            order !== null && order.products.map((product) =>(
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
                    </LegacyCard>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xl: 5, xs: 6 }}>
                    <LegacyCard title="Thông tin khách hàng" >
                        {
                            order && (
                                <>
                                <LegacyCard.Section>
                                {(order.user !== null) ? (order.user.firstName + " " + order.user.lastName) : order.userName}
                                </LegacyCard.Section>
                                <LegacyCard.Section title="Thông tin liên lạc">
                                    <p>{
                                        order.user !== null ? order.user.email : "không có email"
                                    }</p>
                                    <p>{
                                        order.user !== null ? order.user.phoneNumber : "không có SĐT"
                                    }</p>
                                </LegacyCard.Section>
                                <LegacyCard.Section title="Địa chỉ">
                                    <p>
                                        {
                                            "Tòa " + order.addressShiping.split(" ")[0] + 
                                            ", Tầng " + order.addressShiping.split(" ")[1] +
                                            ", Phòng " + order.addressShiping.split(" ")[2]
                                        }
                                    </p>
                                </LegacyCard.Section>
                                </>
                            )

                        }
                        
                    </LegacyCard>
                    <LegacyCard title="Ghi chú">
                    {
                        order && (
                            <LegacyCard.Section>
                                {order.note || <p>không có ghi chú</p>}
                            </LegacyCard.Section>
                        )
                    }
                    </LegacyCard>
                </Grid.Cell>
            </Grid>
            
        </Page>
    )
}

export default OrderDetail