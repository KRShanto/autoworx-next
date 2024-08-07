import { useState } from 'react';
import SliderRange from './SliderRange';


interface FilterforPaymentProps {
    onApply: () => void;
  }
const FilterforPayment = ({ onApply }: FilterforPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<[number, number]>([23, 253]);
  const [status, setStatus] = useState<string>('all');

 const handleSliderChange = (newValue: [number, number]) => {
    setAmount(newValue);
    
}

 interface FilterforPaymentProps {
  onApply: () => void;
}

  return (
    <div className="p-4 border rounded bg-white shadow-md border-[#66738C] mt-2 w-[400px]">
      <div className="mb-4">
        <div className="mb-2 font-Inter">Payment Method</div>
        <div className="flex space-x-2 ">
          {['Method 1', 'Method 2', 'Method 3'].map((method) => (
            <button
              key={method}
              className={` ${paymentMethod === method ? ' px-1 py-1 bg-blue-500 text-[white] rounded border h-[24px] w-[89px] text-xs flex justify-center items-center'
             : ' px-1 py-1 border-gray-300 rounded text-[#66738C border h-[24px] w-[89px] text-xs flex justify-center items-center'}`}
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <div className="mb-2 font-Inter">Amount</div>
        <div className="flex items-center space-x-2">
        <span className='mr-2'>${amount[0]}</span>
        <SliderRange value={amount} onChange={handleSliderChange} />
          <span className='ml-4'>${amount[1]}</span>
        </div>
      </div>
      <div className="mb-4">
        
        <div className="flex space-x-2 text-Inter">
          {['all', 'paid', 'unpaid'].map((statusOption) => (
            <label key={statusOption} className="flex items-center space-x-1">
              <input
                type="radio"
                name="status"
                value={statusOption}
                checked={status === statusOption}
                onChange={() => setStatus(statusOption)}
              />
              <span>{statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded"  onClick={onApply}>Apply</button>
        <button className="px-4 py-2 border border-gray-300 rounded" onClick={() => { setPaymentMethod(null); setAmount([23, 253]); setStatus('all'); }}>Clear All</button>
      </div>
    </div>
  );
};

export default FilterforPayment;
