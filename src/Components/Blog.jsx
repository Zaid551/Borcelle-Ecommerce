import React from "react";
import { Button, Card, Col } from "react-bootstrap";

const Blog = ({ viewMode, data }) => {
  const isGrid = viewMode === "grid";

  return (
    <>
      {data.map((blog) => (
        <Col
          key={blog.id}
          xs={12}
          md={isGrid ? 4 : 12}
          className="mb-4 "
        >
          <Card className="h-100 shadow-sm border-0 overflow-hidden blog-card">
            {isGrid ? (
              <>
                {/* GRID MODE */}
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={blog.image}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                  <span className="position-absolute top-0 start-0 m-3 badge pink-bg text-white px-3 py-2">
                    {blog.category}
                  </span>
                </div>

                <Card.Body className="d-flex flex-column p-4">
                  <Card.Text className="text-muted small mb-2">
                    {blog.date}
                  </Card.Text>

                  <Card.Title className="fw-bold mb-3 h5" style={{ lineHeight: "1.4" }}>
                    {blog.title}
                  </Card.Title>

                  <Card.Text className="text-secondary flex-grow-1">
                    {blog.description.substring(0, 100)}...
                  </Card.Text>

                  <Button
                  variant="outline-dark"
                    className="rounded-pill px-4 fw-semibold mt-auto btn-outline-hover"
                    style={{
                      borderColor: "#F0345D",
                      color: "#F0345D",
                    }}
                    onMouseOver={(e)=>{e.target.style.backgroundColor = '#F0345D'; e.target.style.color = 'white'}}
                    onMouseOut={(e)=>{e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#F0345D'}}
                  >
                    Read More
                  </Button>
                </Card.Body>
              </>
            ) : (
              <>
                {/* LIST MODE */}
                <div className="row g-0 align-items-center flex-nowrap">
                  <div className="col-4 col-md-3 position-relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-100"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />

                    <span className="position-absolute top-0 start-0 m-2 badge pink-bg text-white px-2 py-1">
                      {blog.category}
                    </span>
                  </div>

                  <div className="col-8 col-md-9">
                    <Card.Body className="p-3">
                      <div className="d-flex gap-2 text-muted small mb-2">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.category}</span>
                      </div>

                      <Card.Title className="fw-bold fs-5 mb-2">
                        {blog.title}
                      </Card.Title>

                      <Card.Text className="text-secondary small mb-3">
                        {blog.description}
                      </Card.Text>

                      <Button
                        variant="link"
                        className="text-decoration-none p-0 fw-semibold pink-color save-for-later-btn"
                      >
                        Read More →
                      </Button>
                    </Card.Body>
                  </div>
                </div>
              </>
            )}
          </Card>
        </Col>
      ))}
    </>
  );
};

export default Blog;