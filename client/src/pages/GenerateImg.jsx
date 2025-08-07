import React, { useState } from "react";
import { Edit, Hash, Image, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";


axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

const GenerateImg = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Realistic style",
    "Portrait style"
  ];
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);

  const [content,setContent]=useState('')
  
  const [loading,setLoading]=useState(false)
  const {getToken}=useAuth()
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      
      setLoading(true)
      const prompt=`Generate an image of ${input} in  the style ${selectedStyle}`

      const {data}=await axios.post('/api/ai/generate-image',{prompt,publish},{headers:{
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
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <label className="block mt-4 text-sm font-medium">Describe Your Image</label>
        <textarea
          rows={4}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="w-full p-3 mt-2 text-sm border border-gray-300 rounded-md outline-none resize-none"
          placeholder="Describe what you want to see in the image..."
          required
        />

        <label className="block mt-6 text-sm font-medium">Style</label>
        <div className="mt-3 flex flex-wrap gap-3">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                selectedStyle === item
                  ? "bg-green-50 text-green-600 border-green-300"
                  : "text-gray-500 border-gray-300"
              }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
          </label>
          <span className="text-sm">Make this image Public</span>
        </div>

        <button
        disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 text-sm text-white bg-gradient-to-r from-[#00AD25] to-[#04FF50] rounded-lg hover:opacity-90 transition"
        >
            {loading?<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>:                    <Image className="w-5 h-5" />

                    }
          Generate Image
        </button>
      </form>

      {/* Right column */}
      <div className="w-full lg:max-w-lg p-6 bg-white rounded-lg border border-green-200 shadow min-h-[24rem] flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>
        {!content?( <div className="flex-1 flex justify-center items-center text-center text-gray-400 text-sm">
          <div className="flex flex-col items-center gap-4">
            <Image className="w-9 h-9" />
            <p>Enter a description and click "Generate Image" to get started</p>
          </div>
        </div>):(
          <div className="mt-3 h-full">
            <img src={content} alt="image" className="w-full h-full" />
          </div>
        )}
       
      </div>
    </div>
  );
};

export default GenerateImg;
