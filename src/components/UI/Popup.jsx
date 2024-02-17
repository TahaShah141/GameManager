export const Popup = ({close, children, styles=""}) => {
  return (
    <div onClick={(e) => {e.stopPropagation(); close()}} className={`absolute flex flex-col justify-center items-center top-0 right-0 bg-black/80 h-screen w-screen ${styles}`}>
      {children}
    </div>
  )
}
