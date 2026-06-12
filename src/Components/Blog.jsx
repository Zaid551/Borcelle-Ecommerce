import React from 'react'
import { Button, Card, Col } from 'react-bootstrap';

const Blog = ({viewMode, data}) => {
  const isGrid = viewMode === 'grid';
  return (
    <>
      {data.map((blog) => (
        <Col key={blog.id} xs={12} md={isGrid ? 4 : 12} className="mb-4 d-flex">
          <Card className={`w-100 border-1 shadow-sm blog-card rounded-3 overflow-hidden ${isGrid ? '' : 'd-flex flex-row'}`}>
            <div 
              className="position-relative" 
              style={{ 
                width: isGrid ? '100%' : '350px',
                minWidth: isGrid ? 'auto' : '350px' 
              }}
            >
              <Card.Img 
                variant={isGrid ? "top" : "left"} 
                src={blog.image} 
                style={{ 
                  height: isGrid ? '220px' : '250px', 
                  width: '100%',
                  objectFit: 'cover' 
                }} 
              />
              <span className="position-absolute top-0 start-0 m-3 badge pink-bg text-white px-3 py-2">
                {blog.category}
              </span>
            </div>

            <Card.Body className="d-flex flex-column flex-grow-1 p-4">
              <div className="flex-grow-1">
                <Card.Text className="text-muted small mb-2">{blog.date}</Card.Text>
                <Card.Title className="fw-bold mb-3 h5" style={{ lineHeight: '1.4' }}>
                  {blog.title}
                </Card.Title>
                <Card.Text className="text-secondary small mb-3">
                  {blog.description.substring(0, isGrid ? 100 : 250)}...
                </Card.Text>
              </div>

              <Button 
                variant="outline-dark" 
                className="mt-auto align-self-start rounded-pill px-4 btn-sm fw-bold"
                style={{ borderColor: '#F0345D', color: '#F0345D' }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#F0345D'; e.target.style.color = 'white' }}
                onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#F0345D' }}
              >
                Read More
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  )
}

export default Blog