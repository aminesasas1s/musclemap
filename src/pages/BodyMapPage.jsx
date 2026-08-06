import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { muscles } from '../data'
import Model from 'react-body-highlighter'

const routeMap = {
  trapezius: 'traps',
  'upper-back': 'back',
  'lower-back': 'back',
  chest: 'chest',
  biceps: 'biceps',
  triceps: 'triceps',
  forearm: 'forearms', 
  'back-deltoids': 'shoulders',
  'front-deltoids': 'shoulders',
  abs: 'abs',
  obliques: 'obliques',
  adductor: 'adductors',
  abductors: 'glutes',
  hamstring: 'hamstrings',
  quadriceps: 'leg',
  calves: 'calves',
  gluteal: 'glutes',
  head: 'neck',
  neck: 'neck',
  knees: 'leg',
  'left-soleus': 'calves',
  'right-soleus': 'calves'
}

export default function BodyMapPage() {
  const navigate = useNavigate()
  const [modelType, setModelType] = useState('anterior')

  const handleClick = (muscleData) => {
    let route = routeMap[muscleData.muscle] || muscleData.muscle
    
    // Special case: The front of the lower leg is technically the Tibialis, 
    // but the library labels it as 'calves' on both front and back views.
    if (muscleData.muscle === 'calves' && modelType === 'anterior') {
      route = 'tibialis'
    }

    navigate(`/muscle/${route.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-[20px] sm:rounded-[28px] border border-slate-800 bg-slate-950/50 p-4 sm:p-5 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.24em] text-blue-400">Body Map</p>
            <p className="mt-2 text-sm text-slate-400">Click the body regions to jump to the matching muscle pages.</p>
          </div>
          <button className="rounded-full border border-blue-400/40 bg-slate-900/80 px-4 py-2 text-xs text-blue-200">How it works</button>
        </div>
      </div>

      <div className="rounded-[20px] sm:rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_18%),linear-gradient(180deg,_rgba(7,12,29,0.92),_rgba(3,8,24,0.92))] p-3 sm:p-4 flex flex-col items-center justify-center">
        <div className="flex gap-4 mb-4">
          <button 
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors border border-slate-800 ${modelType === 'anterior' ? 'bg-brand text-slate-950' : 'bg-slate-900/60 text-slate-200'}`}
            onClick={() => setModelType('anterior')}
          >
            Front
          </button>
          <button 
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors border border-slate-800 ${modelType === 'posterior' ? 'bg-brand text-slate-950' : 'bg-slate-900/60 text-slate-200'}`}
            onClick={() => setModelType('posterior')}
          >
            Back
          </button>
        </div>
        <div className="w-full max-w-[400px] bg-slate-900/40 rounded-[28px] p-6 flex justify-center border border-slate-800 hover:border-slate-700 transition-colors">
          <style>{`
            svg.rbh polygon {
              transition: all 0.2s ease-in-out;
            }
            svg.rbh polygon:hover {
              fill: rgba(59, 130, 246, 0.5) !important;
              filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
            }
          `}</style>
          <Model
            data={[]}
            style={{ width: '20rem', padding: '1rem' }}
            onClick={handleClick}
            type={modelType}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-300">
        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
        <span>Click on any muscle below to see exercises</span>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {muscles.map((muscle) => (
          <button
            key={muscle}
            onClick={() => navigate(`/muscle/${muscle.toLowerCase().replace(/\s+/g, '-')}`)}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-brand hover:bg-brand/10"
          >
            {muscle}
          </button>
        ))}
      </div>
    </div>
  )
}
