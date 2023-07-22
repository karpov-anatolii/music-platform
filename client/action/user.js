import axios, { AxiosError } from "axios";

export const registration = async (name, email, password) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}user/registration`,
      {
        name,
        email,
        password,
      },
      { withCredentials: true }
    );
    // alert(response.data);
    // const user = useTypedSelector((state) => state.user.user);

    return response.data;
  } catch (err) {
    alert(err);
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}user/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}user/logout`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const uploadAvatar = (file) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}api/files/avatar`,
        formData,
        // {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // },
        {
          withCredentials: true,
        }
      );
      dispatch(setUser(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteAvatar = () => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}api/files/avatar`,
        {
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(setUser(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};
// export const authUser = (cookies, setUser) => {
//   let regexp = new RegExp("token");
//   let token;
//   if (cookies?.match(regexp)) token = cookies.match(regexp)[0];
//   if (token) {
//     let {
//       data: getUser,
//       isLoading: getUserIsLoading,
//       error: getUserError,
//     } = useAuthQuery({});
//     if (getUser) {
//       setUser(getUser.user);
//       //localStorage.setItem("token", getUser.token);
//     }
//   }
// };
