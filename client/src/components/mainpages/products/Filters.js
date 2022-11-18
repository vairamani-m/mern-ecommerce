import axios from 'axios'
import React, { useState, useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import Categories from '../categories/Categories'

const Filters = () => {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [products, setProducts] = state.productsAPI.products
    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search
    
    const handleChange = (e) =>{
        setCategory(e.target.value)
        setSearch('')
    }
    return (
        <>
        <div className='filter_menu'>
            <div className='row'>
                <span>Filters: </span>
                <select name="category" value={category} onChange={handleChange}>
                    <option value="">All Products</option>
                    {
                        categories.map(category => (
                            <option value={"category="+category._id} key={category._id}>{category.name}</option>
                        ))
                    }
                </select>
            </div>
            <input type="text" value={search} placeholder='Enter your search!' onChange={(e)=>setSearch(e.target.value.toLocaleLowerCase())}/>
            <div className='row sort'>
                <span>Sort By: </span>
                <select name="category" value={sort} onChange={(e)=>setSort(e.target.value)}>
                    <option value=''>Newest</option>
                    <option value='sort=oldest'>Oldest</option>
                    <option value='sort=-sold'>Best sales</option>
                    <option value='sort=-price'>Price: High-Low</option>
                    <option value='sort=price'>Price: Low-High</option>
                </select>
            </div>
        </div>
        </>
    )
}

export default Filters