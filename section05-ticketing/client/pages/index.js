const LandingPage = ({ color }) => {
  console.log('i am in the component', color);
  return <h1>landing page</h1>;
};

LandingPage.getInitialProps = () => {
  console.log('i am on the server');

  return { color: 'red' };
};

export default LandingPage;
