import { suggestions } from '@/app/_components/Hero'
import React from 'react'

const EmptyBoxState = ({onSelectOption}:any) => {
     
  return (
    <div>
        <h2 className='font-bold text-xl text-center'>Start Planning new <strong className='text-primary'>Trip</strong> using AI</h2>
        <p className='text-center text-gray-400 mt-2'> Discover personalized travel itineraries powered by advanced artificial intelligence! Our app offers travel plans tailored to your preferences.</p>
     <div className="flex flex-col gap-5 mt-7">
              {suggestions.map((suggestions, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border 
                    rounded-full p-3 cursor-pointer hover:border-primary hover:text-primary"
                  onClick={()=>onSelectOption(suggestions.title)}  
                >
                  {suggestions.icon}
                  <h2 className="text-lg">{suggestions.title}</h2>
                </div>
              ))}
            </div>
    </div>
  )
}

export default EmptyBoxState