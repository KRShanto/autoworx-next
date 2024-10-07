"use client";
import { regenerateZapierToken } from "@/actions/settings/regenerateZapierToken";
import { successToast } from "@/lib/toast";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BsCopy } from "react-icons/bs";

export default function SecurityPage({ company }: { company: any }) {
  const [showToken, setShowToken] = useState(false);
  const [isTokenGenerating, setIsTokenGenerating] = useState(false);
  if (!company?.zapierToken) {
    regenerateZapierToken();
  }
  return (
    <div className="grid w-full grid-cols-2 items-start gap-4 px-5">
      <div className="space-y-4">
        {/* Contact Number Settings */}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Security</h2>
          <div className="space-y-3 rounded-sm border p-5">
            {/* draft email */}
            <div className="grid grid-cols-1 items-start space-x-3">
              <label className="block">
                <div className="mb-1 px-2 font-semibold">Zapier Token</div>
                <textarea
                  value={
                    company?.zapierToken
                      ? showToken
                        ? company.zapierToken
                        : "•".repeat(240)
                      : "No Token Found"
                  }
                  disabled
                  className="h-[153px] w-full resize-none rounded-sm border border-primary-foreground bg-white p-4 text-lg leading-6 outline-none"
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowToken(!showToken)}
                type="button"
                className="mr-6 rounded-md bg-[#6571FF] px-6 py-1.5 text-white"
              >
                {showToken ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>

              <button
                type="button"
                className="mr-6 rounded-md bg-[#6571FF] px-6 py-1.5 text-white"
                onClick={() => {
                  company?.zapierToken &&
                    navigator.clipboard.writeText(company?.zapierToken);
                  successToast("Token Copied to Clipboard");
                }}
              >
                <BsCopy />
              </button>
              <button
                type="button"
                className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
                disabled={isTokenGenerating}
                onClick={async () => {
                  setIsTokenGenerating(true);

                  regenerateZapierToken()
                    .then(() => successToast("Token Regenerated"))
                    .finally(() => {
                      setIsTokenGenerating(false);
                    });
                }}
              >
                Regenerate Token
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
