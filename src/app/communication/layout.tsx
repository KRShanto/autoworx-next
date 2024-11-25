export default function CommunicationLayout(props: {
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
