// src/components/Layout.jsx
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  return (
    <>
      {token && <Navbar />}
      <main>{children}</main>
    </>
  );
};

export default Layout;
