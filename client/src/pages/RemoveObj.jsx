import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

const RemoveObj = () => {
  
    const [input, setInput] = useState("");
    const [object,setObject]=useState("")
  
  const [loading,setLoading]=useState(false)
  const [content,setContent]=useState('')
  const {getToken}=useAuth()
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      
      setLoading(true)
      if(object.split(' ').length>1){
        return toast('Please enter only one object name')
      }
      const formData=new FormData()
      formData.append('image',input)
      formData.append('object',object)

      const {data}=await axios.post('/api/ai/remove-image-object',formData,{headers:{
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
          <Sparkles className="w-6 text-[#4A7AFF]" />

          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        <label className="block mt-4 text-sm font-medium">Upload Image</label>
        <input
        

        type='file'
        accept='image/*'
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-3 mt-2 text-sm border border-gray-300 rounded-md cursor-pointer outline-none resize-none text-gray-600"
          required
        />

        <label className="block mt-4 text-sm font-medium">Describe object name to remove</label>

          <textarea
          rows={4}
          onChange={(e) => setObject(e.target.value)}
          value={object}
          className="w-full p-3 mt-2 text-sm border border-gray-300 rounded-md outline-none resize-none"
          placeholder="e.g. watch or spoon..."
          required
        />

        <button
        disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 text-sm text-white bg-gradient-to-r from-[#417DF6] to-[#8E37EB] rounded-lg hover:opacity-90 transition"
        >
         
                             {loading?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>:         
                        <Scissors
           className="w-5 h-5" />
}
          Remove Object
        </button>
      </form>

      {/* Right column */}
      <div className="w-full lg:max-w-lg p-6 bg-white rounded-lg border border-gray-200 shadow min-h-[24rem] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
      {!content?(  <div className="flex-1 flex justify-center items-center text-center text-gray-400 text-sm">
          <div className="flex flex-col items-center gap-4">
            <Scissors className="w-9 h-9" />
            <p>Upload an image and click "Remove Object" to get started</p>
          </div>
        </div>):( 
            <img src={content} alt="image" className="mt-3 w-full h-full" />
)}
      </div>
    </div>  )  
}

export default RemoveObj