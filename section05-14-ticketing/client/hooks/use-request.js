import axios from 'axios';
import { useState } from 'react';

//url, method (GET, PUT, POST, PATCH, DELETE)
// method must be equal to 'get' || 'put' || 'patch' || 'post' || 'delete'
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>oops..</h4>
          <ul className="my-0">
            {err.response?.data?.errors.map((err, index) => {
              return <li key={index}>{err.message}</li>;
            })}
          </ul>
        </div>
      );

      // throw err;
    }
  };

  return { doRequest, errors };
};

export default useRequest; //note: hooks use smallcase
