import axios from "axios";
import { IUser } from "../../api/usersApi";
import { axiosInstance } from "../../axiosConfig";

// export const registrationUser = async (newUser: {
//   email: string;
//   password: string;
//   full_name: string;
//   position: string;
// }): Promise<IUser> => {
//   const url = process.env.REACT_APP_AUTH_API_URL;
//   const response = await axiosInstance.post(`${url}/api/register`, newUser, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data;
// };
