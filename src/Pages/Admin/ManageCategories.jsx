import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Col, Form, Row } from 'react-bootstrap';
import { PencilFill, Plus, Trash3Fill } from 'react-bootstrap-icons';
import Pagination from '../../Components/Pagination';

const ManageCategories = () => {
  const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
  const token = getToken()
  ///Category States
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isEditModeCategory, setIsEditModeCategory] = useState(false);
  const [metaCategory, setMetaCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [addCategoryForm, setAddCategoryForm] = useState({})
  const [currentProductId, setCurrentProductId] = useState(null);
  const [showSubModal, setShowSubModal] = useState(false); 
  const [subCategories, setSubCategories] = useState([]); 
  const [parentName, setParentName] = useState(""); 
  
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const categoryPath = "/category"
/////Category Fetch
  const callCategoryApi = (page = 1) =>{
    setIsLoading(true);
    fetch(`${base_url}${categoryPath}?page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    })
    .then(res => {
      if(!res.ok){
        return res.json().then((serverError)=>{
          throw new Error (serverError || 'Something went wrong!')
        })
      }
      return res.json()
    })
    .then(data => {
        if (data.data) {
          setCategories(data.data); 
          setMetaCategory(data.meta); 
        }
      })
    .catch((err)=>{
        console.error("Error fetching data:", err);
    })
    .finally(()=>{
        setIsLoading(false);
    })
  }
  useEffect(() => {
    callCategoryApi()
  }, []);
  const handleShowModalCategory = (category = null) => {
    if (category) {
      setIsEditModeCategory(true);
      setCurrentProductId(category.id);
      setAddCategoryForm({
        name: category.name || "",
        image: null
      });
    } else {
      setIsEditModeCategory(false);
      setCurrentProductId(null);
      setAddCategoryForm({ name: "", image: null });
    }
    setShowCategoryModal(true);
  };
  const handleShowSubCategories = (catId, catName) =>{
    setIsLoading(true)
    fetch(`${base_url}${categoryPath}/${catId}`)
    .then(res => {
      if(!res.ok){
        return res.json().then((serverError)=>{
          throw new Error (serverError || 'Something went wrong!')
        })
      }
      return res.json()
    })
    .then(data => {
        if (data.data) {
          setSubCategories(data.data.categories); 
          setParentName(catName);
          setShowSubModal(true); 
        }
      })
    .catch((err)=>{
        console.error("Error fetching data:", err);
    })
    .finally(()=>{
        setIsLoading(false);
    })
  }
  const handleSubmitCategory = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', addCategoryForm.name);
    
    if (addCategoryForm.image instanceof File) {
      formData.append('image', addCategoryForm.image);
    }

    let url = `${base_url}${categoryPath}`;
    if (isEditModeCategory) {
      url = `${base_url}${categoryPath}/${currentProductId}`;
      formData.append('_method', 'PUT'); 
    }
    console.log(addCategoryForm)
    fetch(url, {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "success") {
        alert(isEditModeCategory ? "Edited Successfully!" : "Added Successfully!");
        setShowCategoryModal(false);
        callCategoryApi();
      }
    })
    .catch(err => console.error(err))
    .finally(() => setIsLoading(false));
  };
  const handleDeleteCategory = (categoryId) => {
  if (window.confirm("Are you sure you want to delete this category?")) {
    setIsLoading(true);

    fetch(`${base_url}${categoryPath}/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "success" || data.code === 1) {
        alert("Successfully deleted!");
        setCategories(prev => prev.filter(p => p.id !== categoryId));
      } else {
        alert("Deletion from server failed");
      }
    })
    .catch(err => console.error("Error deleting:", err))
    .finally(() => setIsLoading(false));
  }
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Categories Management</h3>
        <Button variant="primary" className='send-btn border-0'  
        onClick={() => handleShowModalCategory()}
        ><Plus /> Add New Category</Button>
        <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{isEditModeCategory ? "Edit Category" : "Add New Category"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitCategory} id="addCategoryForm">
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Category Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      required
                      value={addCategoryForm.name}
                      className="shadow-none border-pink"
                      onChange={(e) => setAddCategoryForm({...addCategoryForm, name: e.target.value})}
                      placeholder="Category Name" 
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                <div className='d-flex flex-column align-items-center'>
                  <label 
                      htmlFor="image-category" 
                      className="d-flex align-items-center justify-content-center rounded-2 border overflow-hidden bg-light"
                      style={{ 
                          width: '148px', 
                          height: '148px', 
                          cursor: 'pointer',
                          position: 'relative',
                          border: '2px dashed #dee2e6' 
                      }}>
                      {addCategoryForm.image ? (
                        <img 
                          src={URL.createObjectURL(addCategoryForm.image) || 'https://via.placeholder.com/60'} 
                          alt="preview" 
                          id='image-category'
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                        />
                      ) : (
                        <span className="text-muted small text-center p-2">Click to upload image</span>
                      )}
                  </label>
                  <Form.Control
                  id='image-category'
                  type='file'
                  className='d-none' 
                  accept='image/png, image/jpeg'
                  onInput={(e) => setAddCategoryForm({...addCategoryForm, image: e.target.files[0]})}
                  />
                  
                  <Form.Label className="mt-2" style={{color: "#5C5C5C", cursor: 'pointer'}} htmlFor="image-profile">
                      Add Photo
                  </Form.Label>
                </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            <Button type="submit" form="addCategoryForm" className='send-btn border-0'>
              {isLoading ? "Saving..." : (isEditModeCategory ? "Update Changes" : "Save Category")}
            </Button>
          </Modal.Footer>
        </Modal>
        
      </div>

      <Card className="border-0">
        <Table hover responsive className="align-middle mb-0">
          <thead className="bg-white">
            <tr className="text-center"> 
              <th>Category ID</th>
              <th>Image</th>
              <th>Category Name</th>
              <th>Sub-Categories</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories && categories.length > 0 ? (
              categories
              .filter(cat => cat.name !== null).map((cat) => (
                <tr key={cat.id} className="text-center">
                  <td className="fw-bold text-muted">#{cat.id}</td>
                  <td>
                    <img 
                      src={cat.image || `https://ui-avatars.com/api/?name=${cat.name}&background=fce4ec&color=e91e63`} 
                      alt={cat.name} 
                      className="rounded-circle border border-pink-forProfile" 
                      style={{ width: '45px', height: '45px', objectFit: 'cover', padding: '2px',  }}
                    />
                  </td>
                  <td>
                    <span className={!cat.name ? "text-danger italic" : "fw-medium"}>
                      {cat.name || "Unnamed Category"}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`badge px-3 ${cat.categories_count > 0 ? 'bg-info-subtle text-info' : 'bg-light text-muted'}`}
                      style={{ cursor: cat.categories_count > 0 ? 'pointer' : 'default' }} // تغيير شكل الماوس إذا وجد عناصر
                      onClick={() => cat.categories_count > 0 && handleShowSubCategories(cat.id, cat.name)} // استدعاء الـ API عند الضغط
                    >
                      {cat.categories_count || 0} Items
                    </span>
                  </td>
                  <td className="text-center">
                    <button 
                      size="sm" 
                      className="me-2 btn-action btn-edit"
                      disabled={isLoading}
                      onClick={()=>{handleShowModalCategory(cat)}}>
                      <PencilFill /> 
                    </button>
                    <button 
                      size="sm" 
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteCategory(cat.id)}
                      disabled={isLoading}
                    >
                      <Trash3Fill />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No categories found.</td>
              </tr>
            )}
          </tbody>
        </Table>
        <Modal show={showSubModal} onHide={() => setShowSubModal(false)} centered size="md">
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold">Sub-categories for {parentName}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0">
            {subCategories.length > 0 ? (
              <div className="list-group list-group-flush">
                {subCategories.map((sub) => (
                  <div key={sub.id} className="list-group-item d-flex justify-content-between align-items-center border-0 py-3 shadow-sm mb-2 rounded bg-light">
                    <div className="d-flex align-items-center">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${sub.name}&background=fce4ec&color=e91e63`} 
                        alt={sub.name}
                        className="rounded-circle me-3"
                        style={{ width: '35px', height: '35px' }}
                      />
                      <span className="fw-medium">{sub.name}</span>
                    </div>
                    <span className="text-muted small">ID: #{sub.id}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted py-4">No sub-categories found.</p>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={() => setShowSubModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <div className='p-3'>
          <Pagination meta={metaCategory} onPageChange={(page) => callCategoryApi(page)}/>
        </div>
      </Card>
    </div>
  );
};
export default ManageCategories;