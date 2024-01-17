import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from "mdb-react-ui-kit";
import Dots from "../assets/icons/svg/Dots";

export interface PopUpButtonsProps {
  popUpButtons?: Array<{
    icon?: React.JSX.Element;
    title: string;
    onPress: () => void;
  }>;
}

const PopUpButtons = ({ popUpButtons }: PopUpButtonsProps) => {
  const [isOpenPopUp, setIsOpenPopUp] = useState<boolean>(false);
  const togglePopUpButtons = () => setIsOpenPopUp(!isOpenPopUp);

  return (
    <>
      <Dots onClick={togglePopUpButtons} />
      <MDBModal open={isOpenPopUp} tabIndex="-1" setOpen={setIsOpenPopUp}>
        <MDBModalDialog size="sm" centered>
          <MDBModalContent>
            <MDBModalBody className="d-flex flex-column">
              {popUpButtons?.map((item, index) => (
                <MDBBtn
                  onClick={item.onPress}
                  className="info text-white mb-2 "
                  key={index}
                  style={{ backgroundColor: "#DC4D57" }}
                >
                  {item.icon && <span className="px-2">{item.icon}</span>}
                  {item.title}
                </MDBBtn>
              ))}
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};
export default PopUpButtons;
