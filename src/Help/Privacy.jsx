import React, { useContext, useEffect, useState } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { AuthContext } from '../Contexts/AuthContext'
import { Link } from 'react-router'

const Privacy = () => {
  const {userInfo} = useContext(AuthContext)
    const [policies, setPolicies] = useState([])
      useEffect(()=>{
        fetch(`${import.meta.env.BASE_URL}privacy.json`)
        .then((res)=>{
          return res.json()
        })
        .then((data)=>{
          setPolicies(data)
        })
        .catch((err)=>{
          console.error("Error loading Privacy Policy: ", err)
        })
        .finally(()=>{
            console.log("Call API Ended")
        })
      },[])
  return (
    <div className='bg-white p-5 border' style={{borderRadius: "0 0 20px 20px"}}>
      {userInfo && (<Breadcrumb className="mb-4 " style={{fontSize: '0.9rem'}}>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Privacy Policy</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <h6 className="pink-color fw-bold text-uppercase mb-3">Legal Information</h6>
      <h2 className="fw-bold mb-5">Privacy Policy</h2>
      <div className="custom-scrollbar bg-white rounded-4" 
        style={{ maxHeight: '600px', overflowY: 'auto' }}>
        
        {policies.map((policy) => (
          <div key={policy.id} className="mb-5 pb-3 pe-3 border-bottom last-child-border-0">
            <h4 className="fw-semibold mb-3" style={{ color: '#EC4E70' }}>
              {policy.id}. {policy.title}
            </h4>
            <p className="text-muted lh-lg" style={{ fontSize: '1.05rem' }}>
              {policy.content}
            </p>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-light rounded-3 me-3">
          <p className="small text-secondary mb-0">
            Last Updated: March 2026. For any questions regarding our policy, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Privacy