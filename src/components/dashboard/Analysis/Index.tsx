import { LegacyCard, Page, Grid, LegacyStack, Button } from '@shopify/polaris'
import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Index = () => {
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
    useEffect(() => {
        const fetchAnalysis = async () =>{
            const response = await axios.get("http://localhost:4000/api/analysis/get-all-analysis")
            if(response.data.success){
                setData({
                    labels: [
                        'chưa xác nhận',
                        'đã xác nhận',
                        'thành công'
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
            }
        }
        fetchAnalysis()
    }, [])
    console.log(data);
    
  return (
    <Page>
        <Grid>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số đơn hàng" >
                    <LegacyCard.Section>
                        10
                        <LegacyStack distribution="trailing">
                            <Button plain>Xem sản phẩm</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số đơn hàng" >
                     <LegacyCard.Section>
                        13
                        <LegacyStack distribution="trailing">
                            <Button plain>Xem sản phẩm</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số đơn hàng" >
                    <LegacyCard.Section>
                        17
                        <LegacyStack distribution="trailing">
                            <Button plain>Xem sản phẩm</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:3, xs: 6}}>
                <LegacyCard title="Tổng số đơn hàng" >
                    <LegacyCard.Section>
                        12
                        <LegacyStack distribution="trailing">
                            <Button plain>Xem sản phẩm</Button>
                        </LegacyStack>
                    </LegacyCard.Section>
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:4, xs: 6}}>
                <LegacyCard title="Tổng số đơn hàng" >
                    <Doughnut
                        data={data}
                    />
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:4, xs: 6}}>
                <LegacyCard title="tổng số sản phẩm">
                    <Doughnut
                        data={data}
                    />
                </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xl:4, xs: 6}}>
                <LegacyCard title="tổng số sản phẩm">
                    <Doughnut
                        data={data}
                    />
                </LegacyCard>
            </Grid.Cell>
        </Grid>
    </Page>
  )
}

export default Index