import {
  DialogContentBlank,
  DialogOverlay,
  DialogPortal,
  InterceptedDialog,
} from "@/components/Dialog";
import Image from "next/image";

type TProps = {
  searchParams: {
    url: string;
  };
};

export default function InvoiceImageLoad({ searchParams }: TProps) {
  return (
    <InterceptedDialog>
      <div>
        <DialogPortal>
          <DialogOverlay />
          <DialogContentBlank className="fixed left-[50%] top-[50%] z-50 flex max-h-full w-[65%] translate-x-[-50%] translate-y-[-50%] justify-center gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="no-visible-scrollbar overflow-y-auto">
              <Image
                src={searchParams.url}
                width={1000}
                height={600}
                alt="photo"
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          </DialogContentBlank>
        </DialogPortal>
      </div>
    </InterceptedDialog>
  );
}
