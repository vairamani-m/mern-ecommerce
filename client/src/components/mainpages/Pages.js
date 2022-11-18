import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Products from './products/Products'
import Cart from './cart/Cart'
import Login from './auth/Login'
import Register from './auth/Register'
import NotFound from './utils/not_found/NotFound'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import DetailProduct from './detailproduct/DetailProduct'
import Categories from './categories/Categories'
import CreactProduct from './createproduct/CreactProduct'

import { GlobalState } from '../../GlobalState'

const Pages = () => {
  const state = useContext(GlobalState)
  const [isLogged] = state.userAPI.isLogged
  const [isAdmin] = state.userAPI.isAdmin
  return (
    <Routes>
        <Route exact path="/" element={<Products />}/>
        <Route exact path="/detail/:id" element={<DetailProduct />}/>
        <Route exact path="/cart" element={<Cart />}/>
        <Route exact path="/login" element={isLogged ? <NotFound/> : <Login />}/>
        <Route exact path="/register" element={isLogged ? <NotFound/> : <Register />}/>
        <Route exact path="/category" element={isAdmin ?  <Categories /> : <NotFound/> }/>
        <Route exact path="/create_product" element={isAdmin ?  <CreactProduct /> : <NotFound/> }/>
        <Route exact path="/edit_product/:id" element={isAdmin ?  <CreactProduct /> : <NotFound/> }/>

        <Route exact path="/history" element={isLogged ? <OrderHistory /> : <NotFound/> }/>
        <Route exact path="/history/:id" element={isLogged ? <OrderDetails /> : <NotFound/> }/>

        <Route exact path="*" element={<NotFound />}/>
    </Routes>
  )
}

export default Pages