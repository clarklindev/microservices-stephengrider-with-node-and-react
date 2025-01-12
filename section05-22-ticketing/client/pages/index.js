  //url is (nextjs look at folder structure): https://ticketing.dev
const LandingPage = ({ currentUser }) => {
  console.log('LANDING PAGE');
  return currentUser ? (
    <h1>you are signed in</h1>
  ) : (
    <h1>you are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
