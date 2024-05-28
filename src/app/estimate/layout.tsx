export default function EstimateLayout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {

  return (
    <>
      {props.children}
      {props.modal}
    </>
  );
}
