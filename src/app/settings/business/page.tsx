import Container from "./Container";

const BusinessPage = async () => {
  return (
    <div className="h-full w-[80%] overflow-y-auto p-8">
      <div className="grid grid-cols-2 gap-x-8">
        {/* account detail */}
        <div className="#w-1/2">
          <h3 className="my-4 text-lg font-bold">Account Details</h3>
          <Container />
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
