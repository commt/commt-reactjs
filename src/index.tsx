import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles/commt.css";
import { ComponentType } from "react";
import { CommtContextProvider } from "./context/Context";

const CommtProvider = (OriginalComponent: ComponentType) => {
  return (props) => (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        rel="stylesheet"
      />
      <CommtContextProvider>
        <OriginalComponent {...props} />
      </CommtContextProvider>
    </>
  );
};

export default CommtProvider;
