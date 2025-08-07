import React from 'react'
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import BlogTittles from "./pages/BlogTittles"
import Dashboard from "./pages/Dashboard"
import WriteArticle from "./pages/WriteArticle"
import RemoveBg from "./pages/RemoveBg"
import RemoveObj from "./pages/RemoveObj"
import ReviewResume from "./pages/ReviewResume"
import GenerateImg from "./pages/GenerateImg"
import Community from "./pages/Community"
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from "react-hot-toast"

const App = () => {

  // const {getToken}=useAuth()
  // useEffect(()=>{
  //   getToken().then((token)=>console.log(token)
  //   )
  // },[])
  return (
    <div >
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/ai' element={<Layout/>}>
             <Route index element={<Dashboard/>}/>
             <Route path='blog-titles' element={<BlogTittles/>}/>
             <Route path='write-article' element={<WriteArticle/>}/>
             <Route path='generate-images' element={<GenerateImg/>}/>
             <Route path='remove-background' element={<RemoveBg/>}/>
             <Route path='remove-object' element={<RemoveObj/>}/>
             <Route path='review-resume' element={<ReviewResume/>}/>
             <Route path='community' element={<Community/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App