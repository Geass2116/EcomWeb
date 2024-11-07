import Footer from '../ui/Footer';
import NavBar from '../ui/NavBar';
import { Outlet } from 'react-router-dom';

const Layout = ({ numOfCartItems }) => {
  return (
    <>
      <NavBar numOfCartItems={numOfCartItems} />

      <main>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default Layout;