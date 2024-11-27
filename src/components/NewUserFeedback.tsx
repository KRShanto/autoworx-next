/* eslint-disable @next/next/no-img-element */
"use client";

import { newUserFeedback } from "@/actions/userFeedback/newUserFeedback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { successToast } from "@/lib/toast";
import { useEffect, useState, useTransition } from "react";
import { FaPlus } from "react-icons/fa6";
import { TbReportAnalytics } from "react-icons/tb";
// @ts-ignore
import { useScreenshot } from "use-react-screenshot";

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mimeMatch = arr[0]?.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : ""; // Provide a default value if `mimeMatch` is null
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file: File) => formData.append("photos", file));

  try {
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      console.error("Failed to upload photos");
      return uploadRes.json();
    }

    const json = await uploadRes.json();
    return json.data;
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};

export default function NewUserFeedback({}: {}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, takeScreenshot] = useScreenshot();
  const [files, setFiles] = useState<File[] | []>([]); // State for attached files

  const [isPending, startTransition] = useTransition();

  const getImage = () => takeScreenshot(document.body);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    setFiles([...e?.target?.files]);
  };

  const submitFeedback = () => {
    startTransition(async () => {
      const uploadedScreenshot = image
        ? await uploadFiles([base64ToFile(image, "screenshot.png")])
        : null;
      const uploadedFiles = files.length > 0 ? await uploadFiles(files) : [];

      const photoUrls = uploadedScreenshot
        ? [uploadedScreenshot[0], ...uploadedFiles]
        : uploadedFiles;

      if (title && description) {
        const res = await newUserFeedback({
          title,
          description,
          snapshotImage: uploadedScreenshot ? uploadedScreenshot[0] : null,
          attachments: photoUrls,
        });
        if (res.success) {
          successToast("Feedback submitted successfully");
        }
      }

      setTitle("");
      setDescription("");
      setFiles([]);
      setOpen(false);
    });
  };

  useEffect(() => {
    getImage();

    setTitle("");
    setDescription("");
    setFiles([]);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-white text-[1.7rem] text-[#6571FF]">
          <TbReportAnalytics />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Reports/Feedback</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 p-2">
          <div className="mb-4 flex flex-col">
            <label htmlFor="title">Describe the Issue</label>
            <input
              type="text"
              name="title"
              placeholder="Briefly explain the issue you faced."
              className="mt-2 rounded-md border border-gray-500 p-2 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="description">Expected Behavior</label>
            <textarea
              name="description"
              placeholder="What did you expect to happen instead?"
              className="mt-2 rounded-md border border-gray-500 p-2 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="attachments">
              Attach Screenshot(s) or Image(s)
            </label>
            <input
              type="file"
              name="attachments"
              multiple
              className="mt-2"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <button
              className="rounded-md bg-[#6571ff] px-3 py-1 text-white"
              type="button"
              disabled={isPending}
              onClick={submitFeedback}
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
