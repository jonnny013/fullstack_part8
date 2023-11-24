
const Notification = (props) => {

  if (props.info) {
    setTimeout(() => {
      props.setNotification(null)
    }, 10000)
  }

  const divStyle = {
    width: '100vw', // 100% of the viewport width
    height: '100vh', // 100% of the viewport height
    position: 'fixed',
    zIndex: -1
  }

  const bottomRightDivStyle = {
    position: 'absolute',
    bottom: 50,
    right: 50,
    width: '300px',
    height: '100px',
    backgroundColor: 'lightblue',
    border: '1px black solid',
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5em', // Adjust the font size as needed
    fontFamily: 'Arial, sans-serif',
  }


  return (
    <div style={divStyle}>
      {props.info && <div style={bottomRightDivStyle}>{props.info}</div>}
    </div>
  )
}

export default Notification