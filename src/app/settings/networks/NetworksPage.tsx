"use client";
import {
  connectWithCompany,
  findNearbyCompanies,
  setLatLong,
  toggleAddressVisibility,
  toggleBusinessVisibility,
  togglePhoneVisibility,
} from "@/actions/settings/myNetwork";
import { Switch } from "@/components/Switch";
import { errorToast, successToast } from "@/lib/toast";
import Slider from "@mui/material/Slider";
import { Company } from "@prisma/client";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
type Props = {
  connectedCompanies: Company[] | [];
  unconnectedCompanies: Company[] | [];
  currentCompany: Company | null;
  collaborationDates: Date[] | [];
};

const NetworksPage = ({
  connectedCompanies: connectedCompaniesData = [],
  collaborationDates = [],
  unconnectedCompanies,
  currentCompany,
}: Props) => {
  const [businessVisibility, setBusinessVisibility] = useState(true);
  const [phoneVisibility, setPhoneVisibility] = useState(true);
  const [locationAllow, setLocationAllow] = useState(false);
  const [businessAddressVisibility, setBusinessAddressVisibility] =
    useState(true);

  const [nearbyCompaniesSearch, setNearbyCompaniesSearch] =
    useState<string>("");

  const [connectedCompanies, setConnectedCompanies] = useState<Company[] | []>(
    connectedCompaniesData,
  );
  const [nearbyCompanies, setNearbyCompanies] = useState<Company[] | []>([]);
  const [searchedNearbyCompanies, setSearchedNearbyCompanies] = useState<
    Company[] | []
  >([]);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [nearByCompanyRange, setNearByCompanyRange] = useState<
    [number, number]
  >([0, 100]);
  const [nearByCompanyRangeDebounced, setNearByCompanyRangeDebounced] =
    useState<[number, number]>([0, 100]);

  const handleConnectWithCompany = async (
    companyId: number,
    companyName: string,
  ) => {
    const result = await connectWithCompany(companyId);
    if (result.success) {
      setNearbyCompanies((prevNearby) =>
        prevNearby.filter((company) => company.id !== companyId),
      );
      setConnectedCompanies((prevConnected) => [
        ...prevConnected,
        ...unconnectedCompanies.filter((company) => company.id === companyId),
      ]);
      successToast(`Connected with ${companyName}`);
    } else {
      errorToast(`Failed to connect with ${companyName}`);

      console.log("Failed to connect with the company:", result.message);
    }
  };

  // Create a debounced function for updating the slider value
  const debouncedSetRange = useCallback(
    debounce((value: [number, number]) => {
      setNearByCompanyRangeDebounced(value);
    }, 300), // 300ms debounce delay
    [],
  );

  useEffect(() => {
    if (location.latitude && location.longitude) {
      findNearbyCompanies(
        location.latitude,
        location.longitude,
        nearByCompanyRange,
      ).then((res) => {
        setNearbyCompanies(res.data);
      });
    }
  }, [location, nearByCompanyRangeDebounced]);

  useEffect(() => {
    debouncedSetRange([nearByCompanyRange[0], nearByCompanyRange[1]]);
  }, [nearByCompanyRange]);

  useEffect(() => {
    if (nearbyCompaniesSearch.length > 0) {
      const filteredNearbyCompanies = nearbyCompanies.filter((company) =>
        company.name
          .toLowerCase()
          .includes(nearbyCompaniesSearch.toLowerCase()),
      );
      setSearchedNearbyCompanies(filteredNearbyCompanies);
    } else {
      setSearchedNearbyCompanies(nearbyCompanies);
    }
  }, [nearbyCompaniesSearch, nearbyCompanies]);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setLocationAllow(true);
    } else {
      setLocationAllow(false);
    }
  }, [location]);

  useEffect(() => {
    if (currentCompany) {
      setBusinessVisibility(!!currentCompany?.businessVisibility);
      setPhoneVisibility(!!currentCompany?.phoneVisibility);
      setBusinessAddressVisibility(!!currentCompany?.addressVisibility);
      setLocation({
        latitude: currentCompany?.companyLatitude,
        longitude: currentCompany?.companyLongitude,
      });
    }
  }, [currentCompany]);

  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Collaborations</h3>
          <div className="space-y-8 overflow-y-auto rounded-md p-8 shadow-md">
            {connectedCompanies.length == 0 && (
              <p className="text-center text-sm">No companies found</p>
            )}
            {connectedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center rounded border border-gray-200 px-8 py-4 hover:border-gray-300"
              >
                <Image
                  src="/icons/business.png"
                  alt={company.name}
                  width={40}
                  height={40}
                />
                <div className="ml-4 flex w-full items-center justify-between gap-x-12">
                  <div>
                    <p className="text-lg font-medium">{company.name}</p>
                    {company.website && (
                      <p className="text-sm">{company.website}</p>
                    )}
                    {company.phone && (
                      <p className="text-sm">{company.phone}</p>
                    )}
                    {company.address && (
                      <p className="text-sm">{company.address}</p>
                    )}
                  </div>
                  <div className="text-sm italic">
                    <p>Collaborating since</p>
                    <p>{formatDate(collaborationDates[index])}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* network settings */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Network Settings</h3>

          <div className="space-y-4 rounded-md p-8 shadow-md">
            {/* settings */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span>Business Visibility</span>
                <span>
                  <Switch
                    checked={businessVisibility}
                    setChecked={async (value) => {
                      let res = await toggleBusinessVisibility();
                      if (res?.success) {
                        setBusinessVisibility(value);
                        successToast(
                          "Business visibility updated successfully",
                        );
                      } else {
                        errorToast("Failed to update business visibility");
                      }
                    }}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Business Phone Visibility</span>
                <span>
                  <Switch
                    checked={phoneVisibility}
                    setChecked={async (value) => {
                      let res = await togglePhoneVisibility();
                      if (res?.success) {
                        setPhoneVisibility(value);
                        successToast(
                          "Business phone visibility updated successfully",
                        );
                      } else {
                        errorToast(
                          "Failed to update Business phone visibility",
                        );
                      }
                    }}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Business Address Visibility</span>
                <span>
                  <Switch
                    checked={businessAddressVisibility}
                    setChecked={async (value) => {
                      let res = await toggleAddressVisibility();
                      if (res?.success) {
                        setBusinessAddressVisibility(value);
                        successToast(
                          "Business address visibility updated successfully",
                        );
                      } else {
                        errorToast(
                          "Failed to update business address visibility",
                        );
                      }
                    }}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Allow Location</span>
                <span>
                  <Switch
                    checked={locationAllow}
                    setChecked={async (value) => {
                      if (!value) {
                        setLocation({ latitude: null, longitude: null });
                        setNearbyCompanies([]);
                        setLatLong(null, null);
                        setLocationAllow(false);
                      } else {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                              });
                              setLatLong(
                                position.coords.latitude,
                                position.coords.longitude,
                              );
                            },
                          );
                          setLocationAllow(true);
                        } else {
                          setLocationAllow(false);
                        }
                      }
                      // let res = await toggleAddressVisibility();
                      // if (res?.success) {
                      //   setBusinessAddressVisibility(value);
                      //   successToast(
                      //     "Business address visibility updated successfully",
                      //   );
                      // } else {
                      //   errorToast(
                      //     "Failed to update business address visibility",
                      //   );
                      // }
                    }}
                  />
                </span>
              </div>
              <div className="">
                <p>Company Range Visibility</p>
                <div className="mt-2 flex items-center justify-between">
                  <span>{nearByCompanyRange[0]} miles</span>
                  <div className="w-[70%]">
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      step={1}
                      value={nearByCompanyRange}
                      onChange={(event: Event, value: number | number[]) => {
                        if (Array.isArray(value)) {
                          // Use the debounced function to update the value
                          setNearByCompanyRange([value[0], value[1]]);
                        }
                      }}
                    />
                  </div>
                  {/* <SliderRange
                    value={nearByCompanyRange}
                    onChange={(value: [number, number]) => {
                      setNearByCompanyRange(value);
                    }}
                  /> */}
                  <span>{nearByCompanyRange[1]} miles</span>
                </div>
              </div>
            </div>
          </div>
          {/* possible collaborations nearby */}
          <div className="w-full space-y-2">
            <h3 className="my-4 text-lg font-bold">
              Possible Collaborations Nearby
            </h3>
            <div className="relative h-[35px] w-full rounded-md border border-gray-300 text-gray-400">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 transform">
                <IoSearchOutline />
              </span>
              <input
                name="search"
                type="text"
                className="h-full w-full rounded-md border border-slate-400 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
                value={nearbyCompaniesSearch}
                onChange={(e) => setNearbyCompaniesSearch(e.target.value)}
              />
            </div>
            <div className="space-y-8 overflow-y-auto rounded-md p-8 shadow-md">
              {!locationAllow && (
                <p className="text-center text-sm">
                  Allow location to find nearby companies
                </p>
              )}
              {locationAllow && nearbyCompanies.length == 0 && (
                <p className="text-center text-sm">No companies found</p>
              )}
              {searchedNearbyCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center rounded border border-gray-200 px-8 py-4 hover:border-gray-300"
                >
                  <Image
                    src="/icons/business.png"
                    alt={company.name}
                    width={40}
                    height={40}
                  />
                  <div className="ml-4 flex w-full items-center justify-between gap-x-12">
                    <div>
                      <p className="text-lg font-medium">{company.name}</p>
                      {company.website && (
                        <p className="text-sm">{company.website}</p>
                      )}
                      {company.phone && (
                        <p className="text-sm">{company.phone}</p>
                      )}
                      {company.address && (
                        <p className="text-sm">{company.address}</p>
                      )}
                    </div>
                    <div className="">
                      <button
                        onClick={() => {
                          handleConnectWithCompany(company.id, company.name);
                        }}
                        className="rounded-md bg-[#6571FF] px-4 py-2 text-white"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default NetworksPage;
