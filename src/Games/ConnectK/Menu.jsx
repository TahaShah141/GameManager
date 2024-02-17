import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SettingSlider } from "../../components/UI/SettingSlider"
import { SettingNumber } from "../../components/UI/SettingNumber"
import { Popup } from "../../components/UI/Popup"

export const ConnectKMenu = () => {

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    rows: 6,
    cols: 7,
    K: 4
  })

  useEffect(() => {
    document.title = "ConnectK"
  }, [])

  useEffect(() => {
    setSettings(s=> {return {...s, K:Math.min(s.rows, s.cols, s.K)}})
    console.log("LOOP")
  }, [settings.rows, settings.cols])

  useEffect(() => {
    sessionStorage.setItem("settings", JSON.stringify({...settings, playerCount: 2}))
  }, [settings])
  
  return (
    <div className='flex flex-col h-screen w-screen bg-black items-center justify-center gap-2 text-white'>      
      <div className='flex portrait:w-4/5 landscape:w-2/3 xl:landscape:w-2/5 flex-col gap-2 sm:gap-4'>
        <div className='flex flex-col gap-2 sm:gap-4'>
          <h1 className='text-3xl xs:text-6xl font-mono font-bold'>ConnectK</h1>
          <h2 className='text-lg xs:text-2xl font-semibold'>By Taha Shah</h2>
        </div>
        {!settingsOpen && 
        <button onClick={() => setSettingsOpen(true)} className="flex justify-center items-center flex-1 p-2 text-xl sm:p-4 xs:text-3xl font-bold border-4 rounded-xl border-black bg-neutral-800 hover:bg-neutral-900">Settings</button>}
        {settingsOpen && 
        <>
        <div className="flex w-full gap-4 portrait:hidden">
          <div className="flex-1 bg-neutral-900 rounded-xl font-mono"><SettingNumber label={"Rows"} value={settings.rows} onUpdate={(val) => setSettings(s => {return {...s, rows: val}})} min={3} max={10}/></div>
          <div className="flex-1 bg-neutral-900 rounded-xl font-mono"><SettingNumber label={"Cols"} value={settings.cols} onUpdate={(val) => setSettings(s => {return {...s, cols: val}})} min={3} max={12}/></div>
          <div className="flex-1 bg-neutral-900 rounded-xl font-mono"><SettingNumber label={"K"} value={settings.K} onUpdate={(val) => setSettings(s => {return {...s, K: val}})} min={3} max={Math.min(settings.rows, settings.cols)}/></div>
          <button className="bg-neutral-900 rounded-xl font-mono p-4" onClick={() => setSettingsOpen(false)}><svg className="p-1 h-full aspect-square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/></svg></button>
        </div>
        <Popup close={() => setSettingsOpen(false)} styles="landscape:hidden" innerStyles="w-2/3">
          <div onClick={(e) => e.stopPropagation()} className="w-4/5 p-6 bg-neutral-900 rounded-2xl flex flex-col gap-4">
            <h2 className="text-4xl p-2 font-mono font-semibold tracking-wider text-center">Settings</h2>
            <div className="w-full bg-neutral-800 rounded-xl font-mono"><SettingNumber label={"Rows"} value={settings.rows} onUpdate={(val) => setSettings(s => {return {...s, rows: val}})} min={3} max={10}/></div>
            <div className="w-full bg-neutral-800 rounded-xl font-mono"><SettingNumber label={"Cols"} value={settings.cols} onUpdate={(val) => setSettings(s => {return {...s, cols: val}})} min={3} max={12}/></div>
            <div className="w-full bg-neutral-800 rounded-xl font-mono"><SettingNumber label={"K"} value={settings.K} onUpdate={(val) => setSettings(s => {return {...s, K: val}})} min={3} max={Math.min(settings.rows, settings.cols)}/></div>
          </div>
        </Popup>
        </>
        }
        <div className='flex gap-2 sm:gap-4 w-full'>
          <Link to={`/lobby/connectk`} className='flex justify-center items-center flex-1 p-2 text-xl sm:p-4 xs:text-3xl font-bold border-4 rounded-xl border-black bg-red-500 hover:bg-red-600'>Online</Link>
          <Link to={"play"} className='flex justify-center items-center flex-1 p-2 text-xl sm:p-4 xs:text-3xl font-bold border-4 rounded-xl border-black bg-blue-500 hover:bg-blue-600'>Offline</Link>
        </div>
      </div>
    </div>
  )
}
