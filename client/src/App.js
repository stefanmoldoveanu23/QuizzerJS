import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import NoPage from "./pages/NoPage";

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch("/users/1")
      .then(res => {
        console.log(res);
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(res);
        }
      })
      .then(user => setUser(user))
      .catch(err => err.json().then(err => console.log(err)));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
