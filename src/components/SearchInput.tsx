import { MDBIcon, MDBInputGroup } from "mdb-react-ui-kit";
import { useCommtContext } from "../context/Context";
import { setSearchValue } from "../context/actions/appActions";

const SearchInput = () => {
  const {
    state: {
      app: { searchValue },
    },
    dispatch,
  } = useCommtContext();

  return (
    <MDBInputGroup
      className="rounded-pill mb-3"
      style={{ backgroundColor: "#ECEDED" }}
    >
      <input
        className="form-control rounded-pill"
        placeholder="Search"
        type="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)(dispatch)}
        style={{ backgroundColor: "#ECEDED", color: "#343A3C" }}
      />
      <span className="input-group-text border-0" id="search-addon">
        <MDBIcon fas icon="search" style={{ color: "#B3B6B7" }} />
      </span>
    </MDBInputGroup>
  );
};

export default SearchInput;
