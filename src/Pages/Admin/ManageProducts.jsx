import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Card, Modal, Col, Form, Row } from 'react-bootstrap';
import { PencilFill, Plus, Trash3Fill, EyeFill } from 'react-bootstrap-icons';
import Pagination from '../../Components/Pagination';
import { ProductService } from '../../Services/ProductsServices';
import { useNavigate } from 'react-router';
import DynamicModal from '../../Components/DynamicModal';
const ManageProducts = () => {
  const navigate = useNavigate()
  const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
  const token = getToken()
  const [meta, setMeta] = useState(null);
  const [products, setProducts] = useState([]);
  const [myProductIds, setMyProductIds] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModeProduct, setIsEditModeProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success',
    isConfirm: false
  });
  const showAlertModal = (title, message, type = "success") => {
    setModalConfig({
      show: true,
      title: title,
      message: message,
      type: type, 
      isConfirm: false, 
      onConfirm: () => setModalConfig(prev => ({ ...prev, show: false }))
    });
  };
  const callProductApi = (page = 1) =>{
    setIsLoading(true);
      ProductService.getAllProducts({ mine: 1, token: token })
      .then(myRes => {
        const ids = myRes.data ? myRes.data.map(p => p.id) : [];
        setMyProductIds(ids);

        // 2. جلب كل المنتجات (أو منتجات الصفحة الحالية) للعرض
        return ProductService.getAllProducts({ page: page });
      })
      .then(allRes => {
        if (allRes.data) {
          setProducts(allRes.data);
          setMeta(allRes.meta);
        }
      })
    .catch((err)=>{
        showAlertModal("Error", err, "error");
    })
    .finally(()=>{
        setIsLoading(false);
    })
  }
  useEffect(() => {
    callProductApi()
  }, []);
  const [addProductForm, setAddProductForm] = useState({})
  const handleShowProductModal = (product = null) => {
    if (product) {
      setIsEditModeProduct(true);
      setCurrentProductId(product.id);
      setAddProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category?.id || "",
        image: null 
      });
    } else {
      setIsEditModeProduct(false);
      setCurrentProductId(null);
      setAddProductForm({ name: "", description: "", price: "", category_id: "", image: null });
    }
    setShowProductModal(true);
  };
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const action = isEditModeProduct 
      ?  ProductService.updateProduct(currentProductId, addProductForm, token)
      : ProductService.addProduct(addProductForm, token);

    action
    .then(data => {
      if (data.message === "success") {
        alert(isEditModeProduct ? "Edited Successfully!" : "Added Successfully!");
        setShowProductModal(false);
        showAlertModal(
          isEditModeProduct ? "Updated!" : "Added!",
          isEditModeProduct ? "Product details updated successfully." : "Your new product is live now.",
          "success"
        );
        callProductApi(); 
      }
    })
    .catch(err => console.error(err))
    .finally(() => setIsLoading(false));
  };
  const handleDeleteProduct = (productId) => {
    setModalConfig({
    show: true,
    title: "Confirm Delete",
    message: "Are you sure you want to delete this product? This action cannot be undone.",
    type: "warning",
    isConfirm: true, 
    onConfirm: () => {
      setModalConfig(prev => ({ ...prev, show: false })); 
      setIsLoading(true);
      ProductService.deleteProductById(productId, token)
      .then(data => {
        if (data.message === "success" || data.code === 1) {
          setProducts(prev => prev.filter(p => p.id !== productId));
          setMyProductIds(prev => prev.filter(id => id !== productId));
          showAlertModal("Deleted!", "The product has been removed.", "success");
        } else {
          showAlertModal("Failed", "Server refused to delete the product.", "error");
        }
      })
      .catch(err => {
        console.error("Error deleting:", err);
        showAlertModal("Error", "Could not complete the deletion.", "error");
      })
      .finally(() => setIsLoading(false));
    }
  });
};
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <h3 className="m-0">Products Management </h3>
          <Badge bg="white " className="text-dark border px-3 py-2">
            Total Products: {meta ? meta.total : 0}
          </Badge>
        </div>
        <Button variant="primary" className='send-btn border-0'  onClick={() => handleShowProductModal()}><Plus /> Add New Product</Button>

        
      </div>

      <Card className="shadow-sm border-0">
        <Table hover responsive className="align-middle mb-0">
          <thead className="bg-white">
            <tr className="text-center">
              <th>Product ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => {
                const isMine = myProductIds.includes(product.id);
                return(
                <tr key={product.id} className="text-center">
                  <td className="fw-bold text-muted">#{product.id}</td>
                  <td>
                    <img 
                      src={product.image || 'https://placehold.net/product-400x400.png'} 
                      width="60" 
                      className="rounded" 
                      alt={product.name || 'product'} 
                    />
                  </td>
                  <td>{ product.name || 'product'}</td>
                  <td>${Number(product?.price).toLocaleString()} </td>
                  <td>
                    <button 
                        variant= "link"
                        size="sm" 
                        className="me-2 btn-action btn-view"
                        onClick={() => {navigate(`/products/${product.id}`)}}
                        disabled={isLoading}>
                        <EyeFill />
                      </button>
                    {isMine 
                    ?(<>
                      <button 
                        size="sm" 
                        className="me-2 btn-action btn-edit"
                        onClick={()=>{handleShowProductModal(product)}}
                        disabled={isLoading}>
                        <PencilFill />
                      </button>
                      <button
                        size="sm" 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isLoading}
                      >
                        <Trash3Fill /> 
                      </button>
                    </>)
                    : (<small className="text-muted italic">Read Only</small>)}

                  </td>
                </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No products found.</td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className='p-3'>
          <Pagination meta={meta} onPageChange={(page) => callProductApi(page)}/>
        </div>
      </Card>
        <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{isEditModeProduct ? "Edit Product" : "Add New Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitProduct} id="addProductForm">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Product Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      required
                      value={addProductForm.name || ""}
                      className="shadow-none border-pink"
                      onInput={(e) => setAddProductForm({...addProductForm, name: e.target.value})}
                      placeholder="Product Name" 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Price</Form.Label>
                    <Form.Control 
                      type= "text"
                      required
                      value={addProductForm.price || ""}
                      className="shadow-none border-pink"
                      onInput={(e) => setAddProductForm({...addProductForm, price: e.target.value})}
                      placeholder="Product Price"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Description</Form.Label>
                    <Form.Control 
                      type= "text"
                      required
                      value={addProductForm.description || ""}
                      className="shadow-none border-pink"
                      onInput={(e) => setAddProductForm({...addProductForm, description: e.target.value})}
                      placeholder="Product Description" 
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Category ID</Form.Label>
                    <Form.Control 
                      type= "number"
                      required
                      value={addProductForm.category_id || ""}
                      className="shadow-none border-pink"
                      onInput={(e) => setAddProductForm({...addProductForm, category_id: e.target.value})}
                      placeholder="Category ID" 
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                <div className='d-flex flex-column align-items-center'>
                  <label 
                      htmlFor="image-product" 
                      className="d-flex align-items-center justify-content-center rounded-2 border overflow-hidden bg-light"
                      style={{ 
                          width: '148px', 
                          height: '148px', 
                          cursor: 'pointer',
                          position: 'relative',
                          border: '2px dashed #dee2e6' 
                      }}>
                      {addProductForm.image ? (
                        <img 
                          src={URL.createObjectURL(addProductForm.image) || 'https://via.placeholder.com/60'} 
                          alt="preview" 
                          id='image-product'
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                        />
                      ) : (
                        <span className="text-muted small text-center p-2">Click to upload image</span>
                      )}
                  </label>
                  <Form.Control
                  id='image-product'
                  type='file'
                  className='d-none' 
                  accept='image/png, image/jpeg'
                  onInput={(e) => setAddProductForm({...addProductForm, image: e.target.files[0]})}
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
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>Cancel</Button>
            <Button type="submit" form="addProductForm" className='send-btn border-0'>
              {isLoading ? "Saving..." : (isEditModeProduct ? "Update Changes" : "Save Product")}
            </Button>
          </Modal.Footer>
        </Modal>
        <DynamicModal 
          show={modalConfig.show}
          handleClose={() => setModalConfig({ ...modalConfig, show: false })}
          handleConfirm={modalConfig.onConfirm} 
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          isConfirm={modalConfig.isConfirm}
          showInput={modalConfig.showInput}
        />
    </div>
  );
};
export default ManageProducts;