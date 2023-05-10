import React, { useEffect, useState } from 'react'
import { Box, Container, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import {styled} from "@mui/material/styles"
import axios from 'axios';
import priceFormat from '../../utils/priceFormat';
import { useNavigate } from 'react-router-dom';

interface Order {
  addressShiping: string
  createdAt: string
  id: number
  methodPayment: string
  note:string
  quantityPerProduct: string
  statusOrder: string
  statusPayment: string
  totalPrice: number
  totalPricePerProduct: string
  updatedAt: string
  userName: string
  variant: string
}

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: number
  orders: Order[]
}

interface userRes {
  data: {
      success: boolean,
      data: User[],
      error: {
          fied: string,
          message: string
      },
      message: string
  }
}

const Item = styled(TableRow)(({ theme }) => ({
  ":hover": {
      backgroundColor: "rgba(235, 236, 239, 1)",
      cursor: "pointer"
  }
}));

const Customer = () => {
  const [users, setUser] = useState<User[] | []>([])
  const navigate = useNavigate();

  useEffect(() =>{
    const fetchCustomer = async () =>{
      const response =  await axios.get<any, userRes>("http://localhost:4000/api/user/get-all-user");
      if(response.data.success) {
        setUser(response.data.data);
      }
    }
    fetchCustomer()
  },[])

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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
          <Paper
              sx={{
                  p: 0,
                  display: "flex",
                  flexDirection: "column",
              }}
          >
              <Table size="medium">
                  <TableHead>
                      <TableRow>
                          <TableCell>Id</TableCell>
                          <TableCell>Tên </TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Số điện thoại</TableCell>
                          <TableCell>Đơn hàng</TableCell>
                          <TableCell>Tổng tiền chi</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {
                        users && users.map((user) =>(
                          <Item key={user.id} onClick={() =>{navigate(`/customer/${user.id}`)}}>
                            <TableCell>#{user.id}</TableCell>
                            <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>{user.orders.length} đơn hàng</TableCell>
                            <TableCell>{priceFormat.format(user.orders.reduce((total, item) =>{
                              return total += item.totalPrice
                            }, 0))}</TableCell>
                          </Item>
                        ))
                      }
                  </TableBody>
              </Table>
          </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Customer