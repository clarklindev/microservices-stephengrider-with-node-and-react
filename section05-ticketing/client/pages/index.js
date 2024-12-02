import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>landing page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  console.log(req.headers);

  if (typeof window === 'undefined') {
    //we are on the server requests should follow this format: `http://NAME_OF_SERVICE.NAMESPACE.svc.cluster.local/`
    const response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );
    return response.data;
  } else {
    //we are on the browser, baseURL of ''
    const response = await axios.get('/api/users/currentuser');
    return response.data;
  }

  return {};
};

export default LandingPage;
