import Image from "next/image";
import { HiXCircle } from "react-icons/hi2";

type TProps = {
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function InvoiceEstimateAttachment({photos, setPhotos}: TProps) {
  return (
    <div className="relative flex w-full snap-x gap-6 overflow-x-auto py-2">
      <label className="grid aspect-square h-32 w-32 shrink-0 cursor-pointer snap-center content-center justify-items-center gap-2 rounded-md bg-gray-200 p-2 text-center">
        <input
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            setPhotos((prevPhotos) => [...prevPhotos, file]);
          }}
        />
        <svg
          width="50"
          height="50"
          viewBox="0 0 61 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M41 11L50 2M50 2L59 11M50 2V20M30.5 5H16.4C11.3595 5 8.83928 5 6.91409 5.98094C5.22062 6.8438 3.8438 8.22062 2.98094 9.91409C2 11.8393 2 14.3595 2 19.4V44.6C2 49.6406 2 52.1606 2.98094 54.086C3.8438 55.7795 5.22062 57.1562 6.91409 58.019C8.83928 59 11.3595 59 16.4 59H44C46.79 59 48.185 59 49.3295 58.6934C52.4351 57.8612 54.8612 55.4351 55.6934 52.3295C56 51.185 56 49.79 56 47M24.5 21.5C24.5 24.8137 21.8137 27.5 18.5 27.5C15.1863 27.5 12.5 24.8137 12.5 21.5C12.5 18.1863 15.1863 15.5 18.5 15.5C21.8137 15.5 24.5 18.1863 24.5 21.5ZM37.97 31.7543L12.5934 54.824C11.1661 56.1218 10.4524 56.7704 10.3893 57.3326C10.3346 57.8198 10.5214 58.3028 10.8896 58.6265C11.3143 59 12.2788 59 14.2079 59H42.368C46.6853 59 48.8441 59 50.5397 58.2746C52.6682 57.3641 54.3641 55.6682 55.2746 53.5397C56 51.8441 56 49.6853 56 45.368C56 43.9151 56 43.1888 55.8413 42.5126C55.6415 41.6624 55.259 40.8662 54.7199 40.1792C54.2909 39.6326 53.7236 39.1787 52.5893 38.2715L44.1974 31.5581C43.0622 30.6497 42.4946 30.1955 41.8694 30.0353C41.3183 29.894 40.7387 29.9123 40.1975 30.0881C39.5837 30.2873 39.0458 30.7763 37.97 31.7543Z"
            stroke="#66738C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[10px] font-medium">Attach Photo/Video</span>
      </label>
      {photos.map((photo, i) => (
        <div
          className="relative flex aspect-square h-32 w-32 shrink-0 snap-center rounded border border-solid border-slate-500 object-contain"
          key={i}
        >
          <Image
            src={URL.createObjectURL(photo)}
            className="my-auto h-24 w-32"
            alt={`image-${i}`}
            width={128}
            height={128}
          />

          <button
            type="button"
            onClick={() => setPhotos(photos.toSpliced(i, 1))}
            className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 text-[#6470FF]"
          >
            <HiXCircle size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
