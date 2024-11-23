"use client";
import React, { useState } from "react";
import FilterBySearchBox from "../../components/filter/FilterBySearchBox";
import FilterByDateRange from "../../components/filter/FilterByDateRange";
import FilterBySelection from "../../components/filter/FilterBySelection";
import FilterByMultiple from "../../components/filter/FilterByMultiple";
import { TSliderData } from "./page";

type TProps = {
  searchParams?: {
    search?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    service?: string;
  };
  filterMultipleSliders: TSliderData[];
  getCategory: string[];
  getService: string[];
};

export type TFilterModalState = {
  dateRange: boolean;
  filterRange: boolean;
  category: boolean;
  service: boolean;
};

export default function FilterHeader({
  searchParams,
  filterMultipleSliders,
  getCategory,
  getService,
}: TProps) {
  const [activeModal, setActiveModal] = useState({
    dateRange: false,
    filterRange: false,
    category: false,
    service: false,
  });

  const openModal = (nameOfModal: string) => {
    setActiveModal({ ...activeModal, [nameOfModal]: true });
  };
  const closeModal = (nameOfModal: string) => {
    setActiveModal({ ...activeModal, [nameOfModal]: false });
  };
  const toggleModal = (nameOfModal: string) => {
    const obj = Object.keys(activeModal).reduce((acc, key) => {
      if (key === nameOfModal) {
        return {
          ...acc,
          [nameOfModal]: !activeModal[nameOfModal as keyof TFilterModalState],
        };
      }
      return {
        ...acc,
        [key]: false,
      };
    }, activeModal);
    setActiveModal(obj);
  };

  return (
    <div className="flex w-full items-center justify-between gap-x-3">
      <div className="flex flex-1 items-center space-x-4">
        <FilterBySearchBox searchText={searchParams?.search as string} />
        <FilterByDateRange
          startDate={decodeURIComponent(searchParams?.startDate as string)}
          endDate={decodeURIComponent(searchParams?.endDate as string)}
          modalName="dateRange"
          activeModal={activeModal}
          closeModal={closeModal}
          toggleModal={toggleModal}
        />
      </div>
      <div className="flex items-center space-x-4">
        <FilterByMultiple
          searchParamsValue={searchParams}
          filterSliders={filterMultipleSliders}
          modalName="filterRange"
          activeModal={activeModal}
          closeModal={closeModal}
          toggleModal={toggleModal}
        />
        <FilterBySelection
          selectedItem={searchParams?.category as string}
          items={getCategory}
          type="category"
          modalName="category"
          activeModal={activeModal}
          closeModal={closeModal}
          toggleModal={toggleModal}
        />
        <FilterBySelection
          selectedItem={searchParams?.service as string}
          items={getService}
          type="service"
          modalName="service"
          activeModal={activeModal}
          closeModal={closeModal}
          toggleModal={toggleModal}
        />
      </div>
    </div>
  );
}
