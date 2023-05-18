import * as React from "react";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";
import priceFormat from "../../utils/priceFormat";
import dateFormat from "../../utils/dateFormat";
import { useNavigate } from "react-router-dom";
import { Badge } from "@shopify/polaris";
import {styled} from "@mui/material/styles"
function createDataChart(time: string, amount?: number) {
    return { time, amount };
}
  
  const data = [
    createDataChart('00:00', 0),
    createDataChart('03:00', 300),
    createDataChart('06:00', 600),
    createDataChart('09:00', 800),
    createDataChart('12:00', 1500),
    createDataChart('15:00', 2000),
    createDataChart('18:00', 2400),
    createDataChart('21:00', 2400),
  ];


const Item = styled(TableRow)(({ theme }) => ({
    ":hover": {
        backgroundColor: "rgba(235, 236, 239, 1)",
        cursor: "pointer"
    }
  }));

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}
function DashboardContent() {
    const [orders, setOrders] = React.useState([]);
    const [data, setData] = React.useState([]);
    const date = new Date()
    const navigate = useNavigate()

    React.useEffect(() =>{
        const fetchOrders =  async () =>{
            const responseOrders = await axios.get("http://localhost:4000/api/order/get-all-order")
            const responseOrdersByTime = await axios.get("http://localhost:4000/api/order/get-order-by-time")
            
            if(responseOrders.data.success){
                setOrders(responseOrders.data.data);
            }

            if(responseOrdersByTime.data.success){
                const dataChart = responseOrdersByTime.data.data.map((item: number, index: number) => createDataChart(`${index * 3}:00`, item))
                setData(dataChart);
            }
        }
        fetchOrders().then()
    },[])

    let total = 0;
    orders.map((order:any) =>{
        const dateOrder = new Date(order.createdAt);
        if(dateOrder.getMonth() == date.getMonth() && dateOrder.getDate() == date.getDate()){
            total += order.totalPrice;
        }
    })

    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme: any) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
            }}
        >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Chart */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                height: 240,
                            }}
                        >
                            <React.Fragment>
                                <div>Hôm nay</div>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={data}
                                        margin={{
                                            top: 16,
                                            right: 16,
                                            bottom: 0,
                                            left: 24,
                                        }}
                                    >
                                        <XAxis
                                            dataKey="time"
                                        />
                                        <YAxis
                                        >
                                            <Label
                                                angle={270}
                                                position="left"
                                                style={{
                                                    textAnchor: "middle",
                                                }}
                                            >
                                                Tổng tiền (đ)
                                            </Label>
                                        </YAxis>
                                        <Line
                                            isAnimationActive={false}
                                            type="monotone"
                                            dataKey="amount"
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </React.Fragment>
                        </Paper>
                    </Grid>
                    {/* Recent Deposits */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                height: 240,
                            }}
                        >
                            <Typography
                                component="h2"
                                variant="h6"
                                color="primary"
                                gutterBottom
                            >
                                Doanh thu gần đây
                            </Typography>
                            <Typography component="p" variant="h4">
                                { priceFormat.format(total) }
                            </Typography>
                            <Typography color="text.secondary" sx={{ flex: 1 }}>
                                {(date.getMonth()+ 1) + "/" + date.getDate() + "/" + date.getFullYear()}
                            </Typography>
                            <div>
                                <Link
                                    color="primary"
                                    href="#"
                                    onClick={preventDefault}
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </Paper>
                    </Grid>
                    {/* Recent Orders */}
                    <Grid item xs={12}>
                    <Paper
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ngày</TableCell>
                                        <TableCell>Tên </TableCell>
                                        <TableCell>Địa chỉ </TableCell>
                                        <TableCell>Phương thức thanh toán</TableCell>
                                        <TableCell>Trạng thái thanh toán</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>
                                            Tổng tiền
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order: any) => (
                                        <Item key={order.id} onClick={() => { navigate(`/order/${order.id}`)}}>
                                            <TableCell>{dateFormat(order.createdAt)}</TableCell>
                                            <TableCell>{order.user !== null ? (order.user.firstName + " " + order.user.lastName) : order.userName}</TableCell>
                                            <TableCell>{
                                            "Tòa " + order.addressShiping.split(" ")[0] + 
                                            ", Tầng " + order.addressShiping.split(" ")[1] +
                                            ", Phòng " + order.addressShiping.split(" ")[2]
                                            }</TableCell>
                                            <TableCell>
                                                {order.methodPayment === "1" ? "Thanh toán qua MOMO" : "Thanh toán bằng tiền mặt"}
                                            </TableCell>
                                            <TableCell>
                                                <p>
                                                    {
                                                        (order?.statusPayment === "-1") ? (<Badge status='attention'>Chưa thanh toán</Badge>) : (
                                                            order?.statusPayment === "0" ? (<Badge status='critical'>Thanh toán thất bại</Badge>) : (<Badge status='success'>Đã thanh toán</Badge>))
                                                    }
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p>
                                                    {
                                                        (order?.statusOrder === "-1") ? (<Badge status='attention'>Đang chờ xác nhận</Badge>) : (
                                                            order?.statusOrder === "0" ? (<Badge status='critical'>Đang giao hàng</Badge>) : (<Badge status='success'>Đã giao hàng</Badge>))
                                                       
                                                    }
                                                </p>
                                            </TableCell>
                                            <TableCell>{`${priceFormat.format(order.totalPrice)}`}</TableCell>
                                        </Item>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default function Order() {
    return <DashboardContent />;
}
