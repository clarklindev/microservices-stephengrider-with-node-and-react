import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log('i am in the component', color);
  return <h1>landing page</h1>;
};

LandingPage.getInitialProps = async () => {
  console.log('i am on the server');
  const response = await axios.get('/api/users/currentuser');

  return response.data;
};

export default LandingPage;
