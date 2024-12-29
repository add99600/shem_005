import Home from "./home";
import { SearchCode } from "hanawebcore-frontend";

const useModalParams = () => {
  let params = {
    Home: Home,
    SearchUser: () => (
      <SearchCode resultClassName="tw-min-h-52" ids="COMPANY_MAN" />
    ),
  };

  return params;
};

export default useModalParams;
