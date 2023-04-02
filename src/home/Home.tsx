import Navbar from '../components/layout/Navbar'
import { Outlet, Route, Routes } from 'react-router-dom'
const Home = () => {
  return (
    <Navbar>
        <Outlet/>
    </Navbar>
  )
}

export default Home