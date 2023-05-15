import { LegacyCard, Page, Grid, LegacyStack, Button } from '@shopify/polaris'
import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const Index = () => {
    const navigate =  useNavigate();
    const [total, setTotal] = useState({
        product: 0,
        order: 0,
        flashsale: 0,
        user: 0,
    })
    const [data, setData] = useState({
        labels: [
            'Red',
            'Blue',
            'Yellow'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
    })

    const [dataOrder, setDataOrder] = useState({
        labels: [
            'red',
            'Blue',
            'Yellow'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [0, 0, 0],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
    })
    useEffect(() => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const fetchAnalysis = async () =>{
            const response = await axios.get("http://localhost:4000/api/analysis/get-all-analysis")
            if(response.data.success){
                setDataOrder({
                    labels: [
                        `Tháng ${month - 2}`,
                        `Tháng ${month - 1}`,
                        `Tháng ${month}`,
                    ],
                    datasets: [{
                    label: 'đặt hàng',
                    data: [...response.data.data.ordersPriceMonth],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                    }]
                })
                setData({
                    labels: [
                        'Chưa xác nhận',
                        'Đã xác nhận',
                        'Thành công'
                    ],
                    datasets: [{
                    label: 'đặt hàng',
                    data: [response.data.data.orders.confirm, response.data.data.orders.notConfirm, response.data.data.orders.orderSuccess],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                    }]
                })
                setTotal({
                    user: response.data.data.user,
                    product: response.data.data.product,
                    flashsale: response.data.data.flashsale,
                    order: response.data.data.order
                })
            }
        }
        fetchAnalysis()
    }, [])
    console.log(data);
    
  return (
    <Page>
        <Grid>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số sản phẩm" >
                    <LegacyCard.Section>
                        {total.product}
                        <LegacyStack distribution="trailing">
                            <Button plain onClick={() => navigate("/product")}>Xem sản phẩm</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số đơn hàng" >
                     <LegacyCard.Section>
                        {total.order}
                        <LegacyStack distribution="trailing">
                            <Button plain onClick={() => {navigate("/order")}}>Xem đơn hàng</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số khách hàng" >
                    <LegacyCard.Section>
                        {total.user}
                        <LegacyStack distribution="trailing">
                            <Button plain onClick={() =>{navigate("/user")}}>Xem khách hàng</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số khuyến mãi" >
                    <LegacyCard.Section>
                        {total.flashsale}
                        <LegacyStack distribution="trailing">
                            <Button plain onClick={() => navigate("/flashsale")}>Xem khuyến mãi</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:6, xs: 6}}>
                <LegacyCard title="Tổng số đơn hàng" >
                    <Doughnut
                        data={data}
                    />
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:6, xs: 6}}>
                <LegacyCard title="Tổng đơn đặt hàng trong ba tháng gần nhất">
                    <Doughnut
                        data={dataOrder}
                    />
                </LegacyCard>
            </Grid.Cell>
        </Grid>
    </Page>
  )
}

export default Index