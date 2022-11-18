import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import { useNavigate, useParams } from 'react-router-dom'

const initialState = {
    product_id: "",
    title: "",
    price:0,
    description: "",
    content: "",
    category: "",
    _id:""
}

const CreactProduct = () => {

    const state = useContext(GlobalState)
    
    const [categories] = state.categoriesAPI.categories
    const [products] = state.productsAPI.products

    const [product, setProduct] = useState(initialState)
    const [images, setImages] = useState(null)
    const [loading, setLoading] = useState(false)
    const [onEdit, setOnEdit] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    const [callback, setCallback] = state.productsAPI.callback

    const navigate = useNavigate();
    const param = useParams();

    useEffect(() => {
        if(param.id){
            setOnEdit(true)
            products.forEach(product => {
                if(product._id === param.id) {
                    setProduct(product) 
                    setImages(product.images)
                }
            })
        }else{
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [param.id, products])
    
    const styleUpload ={
        display: images ? "block" : "none"
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            if(!isAdmin) return alert('You are not an admin')
            const file = e.target.files[0]
            console.log('file', file);
            if(!file) return alert('File not exist.')
            if(file.size > 1024*1024) //1mb
                return alert("Size too large!")
            if(file.type !== 'image/jpeg' && file.type !== 'image/png' ) //1mb
                return alert("File format is incorrect!")
            let formData = new FormData();
            formData.append('file', file)
            setLoading(true)
            const res = await axios.post('api/upload', formData, {
                headers:{
                    'content-type' :'multipart/form-data', Authorization: token
                }
            })
            setLoading(false)
            setImages(res.data)
            console.log(res)
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const handleDestroy = async () =>{
        try {
            if(!isAdmin) return alert('You are not an admin')
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.public_id }, {
                headers: { Authorization: token }
            })
            setLoading(false)
            setImages(false)
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setProduct({
            ...product,
            [name]:value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You are not an admin")
            if(!images) return alert("No image upload")

            if(onEdit){
                await axios.put(`http://localhost:5000/api/products/${product._id}`, { ...product, images },{
                    headers: { Authorization: token }
                })
            }else{                
                await axios.post('http://localhost:5000/api/products', { ...product, images },{
                    headers: { Authorization: token }
                })
            }
            setCallback(!callback)
            navigate('/')
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    return (
        <div className='create_product'>
            <div className='upload'>
                <input type="file" name="file" id="file_up" onChange={handleUpload} />
                {
                    loading ? <div id="file_img"><Loading /></div> 
                    :
                    <div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ""} alt="" />
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
            </div>
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <label htmlFor='product_id'>Product ID</label>
                    <input type="text" name="product_id" id="product_id" value={product.product_id} required onChange={handleChangeInput} disabled={onEdit} />
                </div>
                <div className='row'>
                    <label htmlFor='title'>Title</label>
                    <input type="text" name="title" id="title" value={product.title} required onChange={handleChangeInput} />
                </div>
                <div className='row'>
                    <label htmlFor='price'>Price</label>
                    <input type="number" name="price" id="price" value={product.price} required onChange={handleChangeInput} />
                </div>
                <div className='row'>
                    <label htmlFor='description'>Description</label>
                    <textarea type="text" name="description" id="description" value={product.description} required rows="5" onChange={handleChangeInput} />
                </div>
                <div className='row'>
                    <label htmlFor='content'>Content</label>
                    <textarea type="text" name="content" id="content" value={product.content} required rows="7" onChange={handleChangeInput} />
                </div>
                <div className='row'>
                    <label htmlFor='categories'>Category : </label>
                    <select name="category" id="categories" value={product.category} onChange={handleChangeInput}>
                        <option value="">Please select a category</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <button type='submit'>{onEdit ? 'Update':'Create'}</button>
            </form>
        </div>
    )
}

export default CreactProduct