export const SettingNumber = ({ label, value, onUpdate, min=1, max=100, step=1 }) => {
  return (
    <div className="w-full text-xl rounded-xl p-4 flex justify-between items-center border border-black">
      <p>{label}</p>
      <div className="flex border bg-neutral-800 border-black justify-center items-center gap-2 rounded-md overflow-hidden">
        <button className="bg-blue-500 px-1" onClick={() => onUpdate(value <= min ? min : value - step)}>-</button>
        <p>{value}</p>
        <button className="bg-red-500 px-1" onClick={() => onUpdate(value >= max ? max : value + step)}>+</button>
      </div>
    </div>
  )
};
