import Layout from '../components/layout/Layout'
import { Outlet } from 'react-router-dom'
const Home = () => {
  return (
    <Layout>
      <Outlet/>
    </Layout>
  )
}

export default Home