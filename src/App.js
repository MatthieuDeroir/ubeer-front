import React, { useEffect, useState } from 'react';
import { CssBaseline, Container, Box, AppBar, Toolbar, Typography, Button, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import BreweryManagement from './components/BreweryManagement';
import FormatManagement from './components/FormatManagement';
import BeerManagement from './components/BeerManagement';
import Cart from './components/Cart';
import Shop from './components/Shop';


function App() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && !sessionStorage.getItem('userData')) {
        const token = await getAccessTokenSilently();
        const response = await fetch('https://ubeer-api/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        sessionStorage.setItem('userData', JSON.stringify(data));
        setUserData(data);
      } else {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading || (isAuthenticated && !userData)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  const isAdmin = userData?.role === 'admin';

  return (
    <Router>
      <div className="App">
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Ubeer
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            {isAuthenticated && (
              <>
                <Button color="inherit" component={Link} to="/shop">Shop</Button>
                <Button color="inherit" component={Link} to="/cart">Cart</Button>
                {isAdmin && (
                  <>
                    <Button color="inherit" component={Link} to="/manage-breweries">Manage Breweries</Button>
                    <Button color="inherit" component={Link} to="/manage-formats">Manage Formats</Button>
                    <Button color="inherit" component={Link} to="/manage-beers">Manage Beers</Button>
                  </>
                )}
              </>
            )}
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </Toolbar>
        </AppBar>
        <Container>
          <Box my={4}>
            <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/manage-breweries" element={<BreweryManagement />} />
              <Route path="/manage-formats" element={<FormatManagement />} />
              <Route path="/manage-beers" element={<BeerManagement />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Box>
        </Container>
      </div>
    </Router>
  );
}

export default App;
