"use client";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { getOrCreateEmailTemplate,updateEmailTemplate } from "@/actions/settings/emailTemplates";
import { CompanyEmailTemplate } from "@prisma/client";

interface EmailTemplate{
    subject: string;
    message: string;
    companyId: number;
  
}
export default function EstimateAndInvoicePage() {
  const [emailTemplate, setEmailTemplate] = useState<CompanyEmailTemplate | null>(null);
  const [newSubject, setNewSubject] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");


  useEffect(()=>{
    const fetchEmail=async ()=>{

      const template = await getOrCreateEmailTemplate();
      setEmailTemplate(template);
      setNewSubject(template.subject);
      setNewMessage(template.message??"");

    }

    fetchEmail();


  },[])
  const handleUpdate = async () => {
    if (newSubject.trim() && newMessage.trim()&& emailTemplate) {
      const updatedTemplate = await updateEmailTemplate(emailTemplate.id, {
        subject: newSubject,
        message: newMessage,
      });

      setEmailTemplate(updatedTemplate);
      console.log("Template updated:", updatedTemplate);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 px-5">
      <div className="w-full space-y-2">
        <h2 className="text-xl font-semibold">
          Edit Draft Email for Sharing Estimate/Invoice
        </h2>
        <div className="space-y-4 rounded-sm border bg-white p-5">
          <Input
            placeholder="Email Subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="mb-4"
          />
          <div className="mb-2 text-sm font-medium text-gray-500">
            The following message will be sent to the recipient when sharing an
            Invoice/Estimate
          </div>
          <textarea
            placeholder="Enter your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="h-32 w-full resize-none rounded-sm border bg-white p-2 text-sm leading-6 outline-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded-md bg-[#6571FF] px-10 py-1.5 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
