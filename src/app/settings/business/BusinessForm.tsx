"use client";
import { updateCompany } from "@/actions/settings/updateCompany";
import { SlimInput } from "@/components/SlimInput";
import React, { useEffect, useState, useTransition } from "react";
import ProfilePicture from "./ProfilePicture";
import { Company } from "@prisma/client";
import { fetchImageAsFile } from "@/app/estimate/create/SyncEstimate";

type TProps = {
  company: Company;
};

export default function BusinessForm({ company }: TProps) {
  const [imageSrc, setImageSrc] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const photoFiles = async () => {
      if (company.image) {
        const url = `/api/images/${company.image}`;
        const filename = company.image.split("/").pop() || "image.jpg";
        const file = await fetchImageAsFile(url, filename);
        setImageSrc(file);
      }
    };
    photoFiles();
  }, [company.image]);

  const [businessSettings, setBusinessSettings] = useState({
    legalBusinessName: company.name || "",
    businessRegistrationIDNumber: company.businessId || "",
    businessType: company.businessType || "",
    businessPhone: company.phone || "",
    industrySpecialization: company.industry || "",
    businessWebsite: company.website || "",
    companyAddress: company.address || "",
    city: company.city || "",
    state: company.state || "",
    zip: company.zip || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name) {
      setBusinessSettings({ ...businessSettings, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let image = null;
      if (imageSrc) {
        if (company?.image) {
          const response = await fetch(`/api/upload`, {
            method: "DELETE",
            body: JSON.stringify({ filePath: company.image }),
          });
          const json = await response.json();
          if (json.status === "success") {
            console.log("Deleted old image");
          }
        }
        const formData = new FormData();
        formData.append("photos", imageSrc);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          setError("Failed to upload photos");
          console.error("Failed to upload photos");
          setImageSrc(null);
        }

        const json = await uploadRes.json();
        image = json.data[0];
      }

      const companyData = {
        name: businessSettings.legalBusinessName,
        businessId: businessSettings.businessRegistrationIDNumber,
        businessType: businessSettings.businessType,
        phone: businessSettings.businessPhone,
        industry: businessSettings.industrySpecialization,
        website: businessSettings.businessWebsite,
        address: businessSettings.companyAddress,
        city: businessSettings.city,
        state: businessSettings.state,
        zip: businessSettings.zip,
        image,
      };
      const response = await updateCompany(company?.id, companyData);
      if (response.type === "success") {
        setError("");
        console.log("Company updated successfully");
      }
    } catch (err: any) {
      setError(err.message);
      console.log(err.message);
    }
  };
  return (
    <>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      <ProfilePicture
        imageSrc={imageSrc}
        setError={setError}
        setImageSrc={setImageSrc}
      />
      <form
        onSubmit={(e) => startTransition(() => handleSubmit(e))}
        className="space-y-4"
      >
        {/* name and registration number */}
        <div className="grid grid-cols-2 gap-x-8">
          <SlimInput
            value={businessSettings.legalBusinessName}
            onChange={handleChange}
            label="Legal Business Name*"
            name="legalBusinessName"
          />
          <SlimInput
            required={false}
            value={businessSettings.businessRegistrationIDNumber}
            onChange={handleChange}
            label="Business Registration ID Number*"
            name="businessRegistrationIDNumber"
          />
        </div>
        {/* businessType and phone number */}
        <div className="grid grid-cols-2 gap-x-8">
          <SlimInput
            required={false}
            value={businessSettings.businessType}
            onChange={handleChange}
            label="Business Type*"
            name="businessType"
          />
          <SlimInput
            required={false}
            value={businessSettings.businessPhone}
            onChange={handleChange}
            label="Business Phone*"
            name="businessPhone"
            type="number"
          />
        </div>
        {/* industry and website */}
        <div className="grid grid-cols-2 gap-x-8">
          <SlimInput
            required={false}
            value={businessSettings.industrySpecialization}
            onChange={handleChange}
            label="Industry/Specialization"
            name="industrySpecialization"
          />
          <SlimInput
            required={false}
            value={businessSettings.businessWebsite}
            onChange={handleChange}
            label="Business Website"
            name="businessWebsite"
          />
        </div>
        <div className="grid grid-cols-1">
          <SlimInput
            required={false}
            value={businessSettings.companyAddress}
            onChange={handleChange}
            label="Company Address*"
            name="companyAddress"
          />
        </div>
        <div className="grid grid-cols-3 gap-x-8">
          <SlimInput
            required={false}
            value={businessSettings.city}
            onChange={handleChange}
            label="City*"
            name="city"
          />
          <SlimInput
            required={false}
            value={businessSettings.state}
            onChange={handleChange}
            label="State*"
            name="state"
          />
          <SlimInput
            required={false}
            value={businessSettings.zip}
            onChange={handleChange}
            label="Zip*"
            name="zip"
          />
        </div>
        <div className="text-right">
          <button
            disabled={isPending}
            type="submit"
            className="ml-auto mt-4 rounded-md bg-[#6571FF] px-6 py-1 text-white disabled:bg-gray-400"
          >
            {isPending ? "Saving" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}
