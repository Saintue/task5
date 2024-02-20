import axios from "axios";
import { Component } from "react";

const baseURL = "https://itrtask5.onrender.com";
export class Posts extends Component {
  static getUsers = (userData) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${baseURL}/api/getData`, userData)
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}
