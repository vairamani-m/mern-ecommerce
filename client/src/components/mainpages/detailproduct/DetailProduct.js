import React, { useContext, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productitem/ProductItem'

const DetailProduct = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products;
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState({})
    
    useEffect(() => {
        if(params.id){
            products.forEach(product => {
                if(product._id === params.id) setDetailProduct(product)
            });
        }
    }, [params.id, products])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }, [params])

    return (
        <>
        <div className='detail'>
            <img src={detailProduct?.images?.url} alt="image" />
            <div className='box-detail'>
                <div className='row'>
                    <h2>{detailProduct.title}</h2>
                    <h2>#id: {detailProduct.product_id}</h2>
                </div>
                <span>$ {detailProduct.price}</span>
                <p>{detailProduct.description}</p>
                <p>Sold: {detailProduct.sold}</p>
                <Link to="/cart" className="cart"  onClick={()=>addCart(detailProduct)}>Buy Now</Link>
            </div>
        </div>
        <div>
            <h2>Related Products</h2>
            <div className='products'>
                {
                    products.map(product => {
                        return product.category === detailProduct.category ?
                        <ProductItem key={product.product_id} product={product} /> : null
                    })
                }
            </div>
        </div>
        </>
    )
}

export default DetailProduct