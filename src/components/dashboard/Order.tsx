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
    createDataChart('24:00', undefined),
  ];

function createData(
    id: number,
    date: string,
    name: string,
    shipTo: string,
    paymentMethod: string,
    amount: number
) {
    return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
    createData(
        0,
        "16 Mar, 2019",
        "Elvis Presley",
        "Tupelo, MS",
        "VISA ⠀•••• 3719",
        312.44
    ),
    createData(
        1,
        "16 Mar, 2019",
        "Paul McCartney",
        "London, UK",
        "VISA ⠀•••• 2574",
        866.99
    ),
    createData(
        2,
        "16 Mar, 2019",
        "Tom Scholz",
        "Boston, MA",
        "MC ⠀•••• 1253",
        100.81
    ),
    createData(
        3,
        "16 Mar, 2019",
        "Michael Jackson",
        "Gary, IN",
        "AMEX ⠀•••• 2000",
        654.39
    ),
    createData(
        4,
        "15 Mar, 2019",
        "Bruce Springsteen",
        "Long Branch, NJ",
        "VISA ⠀•••• 5919",
        212.79
    ),
];

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}
const mdTheme = createTheme();

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}
function DashboardContent() {
    const [orders, setOrders] = React.useState([]);
    const date = new Date()
    
    React.useEffect(() =>{
        const fetchOrders =  async () =>{
            const responseOrders = await axios.get("http://localhost:4000/api/order/get-all-order")
            if(responseOrders.data.success){
                setOrders(responseOrders.data.data);
            }
        }
        fetchOrders().then()
    },[])

    let total = 0;
    orders.map((order) =>{
        total += order.totalPrice;
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
                                                Sales ($)
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
                                {date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear()}
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
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div>Đơn đặt hàng gần đây</div>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ngày</TableCell>
                                        <TableCell>Tên </TableCell>
                                        <TableCell>Địa chỉ </TableCell>
                                        <TableCell>Phương thức thanh toán</TableCell>
                                        <TableCell align="right">
                                            Tổng tiền
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((order: any) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.createdAt}</TableCell>
                                            <TableCell>{order.user.firstName + " " + order.user.lastName}</TableCell>
                                            <TableCell>{
                                            "Tòa " + order.addressShiping.split(" ")[0] + 
                                            ", Tầng " + order.addressShiping.split(" ")[1] +
                                            ", Phòng " + order.addressShiping.split(" ")[2]
                                            }</TableCell>
                                            <TableCell>
                                                {order.methodPayment === "1" ? "Thanh toán qua MOMO" : "Thanh toán bằng tiền mặt"}
                                            </TableCell>
                                            <TableCell align="right">{`${priceFormat.format(order.totalPrice)}`}</TableCell>
                                        </TableRow>
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
