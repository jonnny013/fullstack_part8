import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {
  return (
    <>
      <Navbar className='bg-body-tertiary'>
        <Container>
          <Navbar.Brand
            href='https://jonnny013.github.io'
            style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
          >
            <img
              alt='logo'
              src='../../mainLogo.png'
              width='50'
              height='40'
              className='d-inline-block align-top'
            />
            My Portfolio
          </Navbar.Brand>
          <Navbar.Brand
            href='https://github.com/jonnny013/fullstack_part8'
            style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
          >
            <img
              alt='logo'
              src='../../GitHub-logo.png'
              width='50'
              height='40'
              className='d-inline-block align-top'
            />
            Source Code
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default Footer;
