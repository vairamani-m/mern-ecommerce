import React, { useState, useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'

const Categories = () => {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [callback, setCallback] = state.categoriesAPI.callback
    const [category, setCategory] = useState("")
    const [token] = state.token
    const [onEdit, setOnEdit] = useState(false)
    const [categoryId, setCategoryId] = useState("")

    const createCategory = async (e) => {
        e.preventDefault()
        try { 
            if(onEdit){
                const res = await axios.put('api/category/'+categoryId, { name: category },{
                    headers:{Authorization: token}
                })
                alert(res.data.message)
            }else{
                const res = await axios.post('api/category', { name: category },{
                    headers:{Authorization: token}
                })
                alert(res.data.message)
            }
                setCategory('')
                setOnEdit(false)
                setCallback(!callback)
            } catch (error) {
                alert(error.response.data.message)
            }
        }

    const editCategory = async (id, name) => {
        setCategory(name)
        setOnEdit(true)
        setCategoryId(id)
    }

    const deleteCategory = async (id) => {
        try { 
                const res = await axios.delete('api/category/'+id, {
                    headers:{Authorization: token}
                })
                alert(res.data.message)
                setCallback(!callback)
        } catch(error) {
                alert(error.response.data.message)
        }
    }

    return (
        <div className='categories'>
            <form onSubmit={createCategory}>
                <label htmlFor='category'>Category</label>
                <input type="text" name="category" value={category} required onChange={(e)=>setCategory(e.target.value)} />
                <button type="submit">{onEdit ? 'Update' : 'Create' }</button>
            </form>
            <div className='col'>
                {
                    categories.map(category => (
                        <div className='row' key={category._id}>
                            <p>{category.name}</p>
                            <div>
                                <button onClick={()=>editCategory(category._id, category.name)}>Edit</button>
                                <button onClick={()=>deleteCategory(category._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Categories