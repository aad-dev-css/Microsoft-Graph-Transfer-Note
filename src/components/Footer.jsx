import React from "react";

const Footer = () => {
    
    let styleDiv = {
        position: 'absolute',
        bottom: '0',
        justifyContent: "center",
        padding: '1px',
        textAlign: 'center',
        backgroundColor: '#1976d2',
    }

    let styleText = {
        color: 'white',
        margin: '8px',
        fontWeight: 'bold',
        fontSize: 'x-small'
    }
      
  return (
    <div className="footer" style={{...styleDiv}}>
        <p style={{...styleText}}>This software was built by using available data from our internal documentation, which sometimes can lead to incorrect values being returned. In such event, the authors of this software will not be held responsible for any kind of event that may occur due to this. If you feel like the output is incorrect or if you would like to submit any idea, please use the feedback form.</p>
    </div>
  );
};

export default Footer;
