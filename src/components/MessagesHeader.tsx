import { MDBCardHeader, MDBCardTitle } from "mdb-react-ui-kit";
import PopUpButtons, { PopUpButtonsProps } from "./PopUpButtons";

const MessagesHeader = ({ popUpButtons }: PopUpButtonsProps) => {
  return (
    <MDBCardHeader className="d-flex justify-content-between  align-items-center ps-2 mb-4">
      <MDBCardTitle style={{ color: "#0D0F0F" }}>Messages</MDBCardTitle>

      {popUpButtons && <PopUpButtons popUpButtons={popUpButtons} />}
    </MDBCardHeader>
  );
};

export default MessagesHeader;
