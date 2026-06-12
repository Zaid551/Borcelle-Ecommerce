import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import { Link } from "react-router";

const Terms = () => {
  const {userInfo} = useContext(AuthContext)
  const termsList = [
    "Acceptance of Terms",
    "Account Creation and Use",
    "Acceptance of Terms",
    "Intellectual Property Rights",
    "Acceptance of Terms",
  ];
  const staticContent = "By using this application, you acknowledge that you have read, understood, and agree to fully comply with these terms. If you do not agree with these terms, please do not use the application. The application management reserves the right to modify these terms at any time, and you will be notified of updates when necessary.";
  
  return (
    <div className="sidebar-container bg-white border" style={{borderRadius: "0 0 20px 20px"}} >
      <Row>
        <Col lg={12}>
          {userInfo && (<Breadcrumb className="my-4 px-4" style={{fontSize: '0.9rem'}}>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
            <Breadcrumb.Item active>Terms & Conditions</Breadcrumb.Item>
          </Breadcrumb>
          )}
          <div className="terms-container custom-scrollbar" style={{ 
            maxHeight: '500px', 
            overflowY: 'auto', 
            paddingRight: '15px'}}>
            {termsList.map((title, index) => (
              <div key={index} className="px-4 py-3 border-bottom" >
                <div className="fw-medium mb-3">
                  <span style={{ color: '#EC4E70', fontSize: "24px", fontWeight: 500 }}>
                    {title}
                  </span>
                </div>
                <div className="p-0 pb-3">
                  <p className="text-muted" style={{ lineHeight: '1.6' }}>
                    {staticContent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

    </div>
  )
}

export default Terms