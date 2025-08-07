import { useAuth } from '@clerk/clerk-react';
import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from "axios"

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

const RemoveBg = () => {


    const [input, setInput] = useState("");
  
     const [loading,setLoading]=useState(false)
  const [content,setContent]=useState('')
  const {getToken}=useAuth()
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      
      setLoading(true)
      const formData=new FormData()
      formData.append('image',input)

      const {data}=await axios.post('/api/ai/remove-image-background',formData,{headers:{
        Authorization:`Bearer ${await getToken()}`
      }})
      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
              toast.error(error.message)

    }
    setLoading(false);

  };
  return (
 <div className="h-full overflow-y-auto p-6 flex flex-col lg:flex-row items-start gap-6 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:max-w-lg p-6 bg-white rounded-lg border border-gray-200 shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <label className="block mt-4 text-sm font-medium">Upload Image</label>
        <input
        

        type='file'
        accept='image/*'
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-3 mt-2 text-sm border border-gray-300 rounded-md cursor-pointer outline-none resize-none text-gray-600"
          required
        />

<p className='text-sx text-gray-500 font-light mt-1'>Supports JPG, PNG, and other image formates</p>
        <button
        disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 text-sm text-white bg-gradient-to-r from-[#F6AB41] to-[#FF4938] rounded-lg hover:opacity-90 transition"
        >
                  {loading?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>:          <Eraser
           className="w-5 h-5" />
}
         
          Remove Background
        </button>
      </form>

      {/* Right column */}
      <div className="w-full lg:max-w-lg p-6 bg-white rounded-lg border border-gray-200 shadow min-h-[24rem] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
       {!content?( <div className="flex-1 flex justify-center items-center text-center text-gray-400 text-sm">
          <div className="flex flex-col items-center gap-4">
            <Eraser className="w-9 h-9" />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>
        </div>):(
            <img src={content} alt="image" className="mt-3 w-full h-full" />
        )}
      </div>
    </div>  )
}

export default RemoveBg