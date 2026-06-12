import React from 'react'
import { EmojiFrown, Eye } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router'

const SearchList = ({results, setShowResults}) => {
  const navigate = useNavigate()
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`); 
    setShowResults(false);
  };
  return (
    <div className='results-list'>
      {results.map((result) => {
        return <div key={result.id} className='search-result' onMouseDown={()=>{handleProductClick(result.id)}}>
            <div className='d-flex align-items-center'>
              <div style={{width: "50px", height: "50px"}}>
                <img src={result.image} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
              </div>
              <span className="ms-2">{result.name}</span>
            </div>
            <Eye className="ms-2"/>
          </div>
      })}
      {results.length === 0 && <div className="p-2 text-center">
        <EmojiFrown/> 
        <span className='ps-3'>No results found</span>
      </div>}
    </div>
  )
}

export default SearchList