import { ReactNode, useState, useEffect } from 'react';

interface PhoneContainerProps {
  children: ReactNode;
}

export default function PhoneContainer({ children }: PhoneContainerProps) {
  const [timeStr, setTimeStr] = useState<string>('12:41');

  useEffect(() => {
    // Keep a beautiful live clock matching iOS style!
    const updateTime = () => {
      const now = new Date();
      let hrs = now.getHours();
      let mins: string | number = now.getMinutes();
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12; // 0 should be 12
      mins = mins < 10 ? '0' + mins : mins;
      setTimeStr(`${hrs}:${mins}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative select-none p-4 pb-6 pt-5 bg-white border-[10px] border-[#EADFCB] rounded-[48px] shadow-[0_12px_45px_rgba(43,29,18,0.14)] w-[360px] h-[720px] mx-auto flex flex-col bg-[#FDFBF7] overflow-hidden">
      
      {/* Phone Camera Notch Container */}
      <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-40 select-none pointer-events-none">
        <div className="bg-[#EADFCB] w-36 h-4.5 rounded-b-2xl flex items-center justify-center">
          {/* Inner camera dot */}
          <div className="w-2 h-2 rounded-full bg-[#D1C3B0] ml-3" />
          <div className="w-10 h-1 bg-[#D1C3B0] rounded-full ml-2" />
        </div>
      </div>

      {/* iOS TOP STATUS BAR */}
      <div className="h-6.5 flex justify-between items-center px-6 pt-1 text-[11px] font-display font-bold text-[#6D5A46] z-30 select-none pointer-events-none">
        {/* Clock text */}
        <span>{timeStr}</span>
        
        {/* Icons (battery, wifi, signals) */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {/* Signal dots */}
          <div className="flex items-end gap-0.5 h-2">
            <span className="w-[2.5px] h-[3px] bg-[#6D5A46] rounded-[0.5px]" />
            <span className="w-[2.5px] h-[5px] bg-[#6D5A46] rounded-[0.5px]" />
            <span className="w-[2.5px] h-[7px] bg-[#6D5A46] rounded-[0.5px]" />
            <span className="w-[2.5px] h-[9px] bg-[#6D5A46] rounded-[0.5px]" />
          </div>
          
          {/* Wifi wave vector */}
          <svg className="w-3 h-3 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.284 16.284A3 3 0 0012 17a3 3 0 003.716-1.716M5.456 13.456a6.5 6.5 0 0113.088 0M1.8 9.8a11.5 11.5 0 0120.4 0" />
          </svg>

          {/* Battery capsule */}
          <div className="w-5 h-2.5 border-[1.5px] border-[#6D5A46] rounded-[3px] p-[1px] flex items-center">
            <div className="h-full w-[85%] bg-[#6D5A46] rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* INTERNAL SCREEN BODY WRAPPER */}
      <div className="flex-1 overflow-hidden relative rounded-[28px] bg-[#FCFAF5] flex flex-col mt-1 focus:outline-none">
        {children}
      </div>

      {/* iOS VIRTUAL HOME BOTTOM BAR */}
      <div className="h-4 flex justify-center items-end select-none pointer-events-none pb-1.5 z-40">
        <div className="w-24 h-1 bg-[#C7BAA6] rounded-full" />
      </div>
    </div>
  );
}
export { PhoneContainer };
