import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('LANDING PAGE');
  return currentUser ? (
    <h1>you are signed in</h1>
  ) : (
    <h1>you are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const request = await client.get('/api/users/currentuser');
  return request.data;
};

export default LandingPage;
