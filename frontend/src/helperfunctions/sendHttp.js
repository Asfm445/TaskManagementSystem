import api from "../api";

export function send({ inputs, setFetch, fetch, route, navigate }) {
  try {
    console.log(inputs);
    api
      .post(route, inputs)
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          setFetch(!fetch);
        }
      })
      .catch((err) => {
        if (err.status == 401) {
          navigate("/login");
        }
      });
  } catch (err) {
    console.log(err);
  }
}
