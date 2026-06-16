import { Row, Col, Button, Alert, Form, Tab, Nav, Modal, Spinner, Table, Card, Badge } from "react-bootstrap";
import { CaretRightFill, Cash, PencilSquare, ExclamationCircle, ExclamationSquare, BoxArrowRight, Telephone, GeoAltFill, PhoneFill, BuildingFill, SignpostSplitFill, Pencil, PencilFill, GeoFill, Trash3Fill, CartCheckFill, CartDashFill, Cart, CartFill, CartPlusFill, BoxFill, BookmarksFill, Map, MapFill, Eye, ThreeDotsVertical, EyeFill, EmojiFrownFill, Calendar4Event, TicketPerforated, HeartFill } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import DynamicModal from "../Components/DynamicModal";
// import Pagination from '../Components/Pagination';
import { ProductService } from "../Services/ProductsServices";
import { AuthServices } from "../Services/Auth";
import WishlistContent from "../Components/WishlistContent"
import { WishlistContext } from "../Contexts/WishlistContext";

const Profile = () => { 
  const location = useLocation()
  const [key, setKey] = useState("account");
  useEffect(() => {
  const hash = location.hash.replace('#', '');
  if (hash) {
    setKey(hash);
  }
}, [location]);
  const {wishlistItems} = useContext(WishlistContext);
  const navigate = useNavigate()
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const addressPath = "/address"
  const orderPath = "/order"
  const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
  const token = getToken()
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const { userInfo, setUserInfo, logout, loading } = useContext(AuthContext);
  const [userUpdate, setUserUpdate] = useState({
    name: "",
    phone: ""
  });
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success',
    isConfirm: false
  });
  const [cancelReason, setCancelReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const handleLogout = ()=>{
    setModalConfig({
      show : true,
      title: 'We Losing You!!',
      message: "Are you sure you want to log out?",
      type: 'confirm',
      isConfirm: true,
      showInput: false,
      onConfirm: () => {
        logout(); 
        setModalConfig(prev => ({ ...prev, show: false })); 
        navigate('/');
      }
    })
  }
  const [isEditMode, setIsEditMode] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [settingsLinks, setSettingsLinks] = useState([]);
  const [error, setError] = useState(null)
  ////Address States
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    city: "",
    neighborhood: "",
    street: "",
    building: "",
    zip_code: "",
    lat: "3.12312",
    lng: "4.12312",
    is_default: true
  });
  const [isEditAddressMode, setIsEditAddressMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
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
  const handleUpdateProfile = (e) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (!token) {
      setError("The session has ended, please log in again.");
      setIsLoading(false);
      return;
    }
    AuthServices.update_profile(token, userUpdate.name)
    .then((result) => {
        if (result.code === 1 || result.message === "success") {
          const savedData = JSON.parse(localStorage.getItem('userData'));
          const updatedUser = {
            ...userInfo, 
            name: userUpdate.name,
            phone: userUpdate.phone
          };
          const newLocalData = {
            ...savedData,
            data: {
              ...savedData.data,
              name: userUpdate.name, 
              phone: userUpdate.phone,
              user: updatedUser 
            }
          };
            localStorage.setItem('userData', JSON.stringify(newLocalData));
            setUserInfo(updatedUser);
            setIsEditMode(false);
            alert("Saved successfully!");
        }
    })
    .catch((err) => {
        setError(err.message);
    })
    .finally(() => {
        setIsLoading(false);
    });
};
  useEffect(()=>{
      if (userInfo) {
        setUserUpdate({
            name: userInfo.name || userInfo.data?.name || "",
            phone: userInfo.phone || userInfo.data?.phone || ""
        });
    }
  }, [userInfo])
  const [addresses, setAddresses] = useState([]); 
  ///Products States
  // const [meta, setMeta] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null);
  const [addProductForm, setAddProductForm] = useState({})
  const [isEditModeProduct, setIsEditModeProduct] = useState(false);
useEffect(()=>{
    const callAddressApi = () =>{
      fetch(`${base_url}${addressPath}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
        console.log(data.data)
        if(data.code === 1){
          setAddresses(data.data)
        }
      })
      .catch((err)=>{
        setError(err);
      })
      .finally(()=>{
        setIsLoading(false);
      })
    }
    callAddressApi()
  },[token])
  const handleAddClick = () => {
    setIsEditAddressMode(false);
    setAddressData({ name: "", phone: "", city: "", neighborhood: "", street: "", building: "", zip_code: "", lat: "3.12312", lng: "4.12312", is_default: true });
    setShowModal(true);
  };
  const handleEditClick = (address) => {
    setIsEditAddressMode(true);
    setCurrentAddressId(address.id);
    setAddressData(address); 
    setShowModal(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditAddressMode ? "PUT" : "POST";
    const url = isEditAddressMode ? `${base_url}${addressPath}/${currentAddressId}` : `${base_url}${addressPath}`;
    const callApiAddress = () => {
      setIsLoading(true);
      console.log("Data to be sent:", addressData);
      fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData)
      })
      .then(res => {
        if(!res.ok){
          return res.json().then((serverError)=>{
            throw new Error (serverError || 'Something went wrong!')
          })
        }
        return res.json()
        })
      .then((data) => {
        console.log( data);
        if (data.code === 1) {
          if (isEditAddressMode) {
            setAddresses(prev => prev.map(addr => addr.id === currentAddressId ? data.data : addr));
          } else {
            setAddresses(prev => [...prev, data.data]);
          }
          setShowModal(false);
          resetAddressForm(); 
          showAlertModal(
          isEditAddressMode ? "Address Updated" : "Address Added",
          isEditAddressMode ? "Your address details have been updated successfully." : "The new address has been added to your profile.",
          "success"
          );
        } else {
          showAlertModal("Failed", data.message || "Something went wrong!", "error");
        }
      })
      .catch((err) => {
        showAlertModal("Error", err.message, "error");
      })
      .finally(() => {
        setIsLoading(false)
      });
    }
    callApiAddress()
};

const resetAddressForm = () => {
  setAddressData({
    name: "", phone: "", city: "", neighborhood: "", street: "", 
    building: "", zip_code: "", lat: "3.12312", lng: "4.12312", is_default: true
  });
  setIsEditAddressMode(false);
  setCurrentAddressId(null);
};

const handleRemoveAddress = (addressId) => {
  setModalConfig({
    show: true,
    title: "Delete Address",
    message: "Are you sure you want to delete this address? This action cannot be undone.",
    type: "warning",
    isConfirm: true,
    onConfirm: () => {
      setModalConfig(prev => ({ ...prev, show: false })); 
      setDeletingId(addressId);
      
      fetch(`${base_url}${addressPath}/${addressId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || 'Something went wrong!')
          })
        }
        return res.json()
      })
      .then((data) => {
        if (data.code === 1) {
          setAddresses(prev => prev.filter(item => item.id !== addressId));
          showAlertModal("Deleted!", "The address has been removed successfully.", "success");
        } else {
          showAlertModal("Error", data.message || "Failed to delete address.", "error");
        }
      })
      .catch((err) => {
        showAlertModal("Error", err.message, "error");
      })
      .finally(() => {
        setDeletingId(null)
      });
    }
  });
};
  useEffect(()=>{
    fetch(`${import.meta.env.BASE_URL}settingsLinks.json`)
    .then((res)=>{
      return res.json()
    })
    .then((data)=>{
      setSettingsLinks(data)
    })
    .catch((err)=>{
      console.error("Error loading features:", err)
    })
    .finally(()=>{
        console.log("Call API Ended")
    })
  },[])
  const [showModal, setShowModal] = useState(false)
  ////Order
const [orders, setOrders] = useState([]);
const [metaOrder, setMetaOrder] = useState(null);
useEffect(() => {
  const fetchOrders = (page = 1) => {
  setIsLoading(true);
  fetch(`${base_url}${orderPath}?page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  .then(res => {
    if (!res.ok) {
        return res.json().then((serverError) => {
            throw new Error(serverError.message || "Unauthenticated or Error!");
        });
    }
    return res.json();
  })
  .then(data => {
    if (data.code === 1) {
      setOrders(data.data);
      setMetaOrder(data.meta);
    }
  })
  .catch(err => setError(err.message))
  .finally(() => setIsLoading(false));
};
  fetchOrders();
}, [token]);
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "warning",
      COMPLETED: "success",
      CANCELLED: "danger",
      SHIPPED: "info"
    };
    return <Badge bg={styles[status] || "secondary"}>{status}</Badge>;
  };
/// Order View Details
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
const handleViewDetails = (orderId) => {
  setIsLoading(true);
  fetch(`${base_url}${orderPath}/${orderId}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) {
        return res.json().then((serverError) => {
            throw new Error(serverError.message || "Unauthenticated or Error!");
        });
    }
    return res.json();
  })
  .then(data => {
    if (data.code === 1) {
      setSelectedOrderDetails(data.data);
      setShowDetailsModal(true);
    }
  })
  .catch(err => setError(err.message))
  .finally(() => setIsLoading(false));
};
////Order Cancel
const handleCancelOrderTrigger = (orderId) => {
    setOrderToCancel(orderId); 
    setCancelReason(""); 
    setModalConfig({
        show: true,
        title: "Cancel order",
        message: "Please enter the reason for cancellation to proceed:",
        type: "warning",
        isConfirm: true,
        showInput: true,
        onConfirm: handleFinalCancelConfirm
    });
};
const handleFinalCancelConfirm = () => {
  if (!cancelReason.trim()) return;
  if (window.confirm("Are you sure you want to cancel this order?")) {
    setIsLoading(true);
    fetch(`${base_url}${orderPath}/${orderToCancel}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        _method: "DELETE", 
        comment: cancelReason
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.code === 1) {
        setModalConfig(prev => ({ ...prev, show: false }));
        setOrders(prev => prev.map(order => 
            order.id === orderToCancel ? { ...order, status: "CANCELED" } : order
        ));
        setTimeout(() => {
          setModalConfig({
              show: true,
              title: "Cancelled",
              message: "The order status has been successfully updated to canceled.",
              type: "success",
              isConfirm: false,
              showInput: false
          });
      }, 500);
      } 
    })
    .catch(err => console.log(err))
    .finally(() => setIsLoading(false));
  }
};
/////Product Fetch
  const callProductApi = () => {
  setIsLoading(true);
  ProductService.getAllProducts({ 
      mine: 1, 
      token: token 
    })
    .then(data => {
      if (data && data.data) {
        setProducts(data.data); 
      } else {
        setProducts([]);
      }
    })
    .catch(err => {
      console.error("Error fetching my products:", err)
      showAlertModal("Error", err, "error");
    })
    .finally(() => setIsLoading(false));
};
  useEffect(() => {
    callProductApi()
  }, [])
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
if (loading) return (<>
    <Card className="text-center p-5 border-0 bg-transparent">
      <Card.Body>
        <div className="display-1 mb-3"><Spinner animation="border pink-color" size="md" variant="danger" /></div>
        <Card.Title className="h5 text-muted">Loading Profile...</Card.Title>
      </Card.Body>
    </Card>
  </>)
  return (
    <div className='bg-white border' style={{borderRadius: "0 0 20px 20px"}}>
      <Tab.Container id="profile-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        <Row className="justify-content-between px-4 py-4">
          {/* Sidebar */}
          <Col lg={3} md={4}>
            <div className="bg-white border rounded-3 p-4 shadow-sm h-100 text-center">
              <div className="profile-img-container  position-relative d-inline-block mb-3">
                <img
                    src={userInfo?.data?.image || defaultAvatar}
                    alt="Profile"
                    className="rounded-circle pink-border shadow-sm"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #e91e63' }}
                />
                <div className="position-absolute bottom-0 end-0 pink-bg text-white rounded-circle p-1 border border-white" style={{ cursor: 'pointer' }}>
                    <PencilSquare size={18} />
                </div>
              </div>
              <h5 className="fw-bold mb-4 border-bottom pb-3">{userUpdate.name || userInfo?.data?.name  || "User Name"}</h5>
              <Nav variant="pills" className="flex-column align-items-start text-start custom-nav-pills ">
                <Nav.Item className="w-100">
                  <Nav.Link eventKey="account" href="#account" className="py-3 d-flex justify-content-between align-items-center gap-5 w-100">
                    Account <CaretRightFill className="arrow-icon" />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-100">
                  <Nav.Link eventKey="address" href="#address" className="py-3 d-flex justify-content-between align-items-center gap-5 w-100">
                    Address <GeoAltFill className="arrow-icon" />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-100">
                  <Nav.Link eventKey="orders" href="#orders" className="py-3 d-flex justify-content-between align-items-center gap-5 w-100">
                    Orders <CartCheckFill className="arrow-icon" />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-100">
                  <Nav.Link eventKey="product" href="#product" className="py-3 d-flex justify-content-between align-items-center gap-5 w-100">
                    Products <BoxFill className="arrow-icon" />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-100">
                  <Nav.Link eventKey="wishlist" href="#wishlist" className="py-3 d-flex justify-content-between align-items-center gap-5 w-100">
                    Wishlist <HeartFill className="arrow-icon" />
                  </Nav.Link>
                </Nav.Item>
                <Button onClick={handleLogout} 
                  variant="link" className="text-danger text-decoration-none text-start py-3 px-3 mt-3 fw-bold border-0">
                  <BoxArrowRight className="me-2" /> Log Out
                </Button>
              </Nav>
            </div>
          </Col>
          {/* Content */}
          <Col lg={9} md={8}>
          <div className="bg-white border rounded-3 p-4 p-md-5 shadow-sm h-100">
            <Tab.Content>
              <Tab.Pane eventKey="account">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0">Account Details</h4>
                  </div>

                  <Form id="profileForm" onSubmit={  handleUpdateProfile} className="fade-in">
                    <Row className="g-4 empty-state-container">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="text-uppercase small fw-bold text-muted">First Name *</Form.Label>
                          <Form.Control
                            type="text"
                            className={`form-control py-3 shadow-none ${isEditMode ? 'border-1 border-pink-forProfile' : 'border-0'}`}
                            value= {userUpdate.name}
                            onChange={(e)=>{
                              const value = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g,"");
                              setUserUpdate({
                                  ...userUpdate,
                                  "name":  value
                              })
                            }}
                            readOnly ={!isEditMode}
                            style={{ backgroundColor: isEditMode ? '#fff' : '#F9F9F9' }} />
                            {userUpdate.name && userUpdate.name.trim().length < 6 && (
                              <div className="text-danger small mt-1"><ExclamationCircle size={14}/> Min 6 characters</div>
                            )}
                        </Form.Group>
                      </Col>
                          
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="text-uppercase small fw-bold text-muted">Email Address</Form.Label>
                          <Form.Control
                            className={`form-control py-3 shadow-none ${isEditMode ? 'border-1 border-pink-forProfile' : 'border-0'}`}
                            type="email"
                            value={userInfo?.data?.email || ""}
                            readOnly
                            style={{ backgroundColor: isEditMode ? '#fff' : '#F9F9F9' }} />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="text-uppercase small fw-bold text-muted">Phone Number *</Form.Label>
                          <Form.Control
                            className={`form-control py-3 shadow-none ${isEditMode ? 'border-1 border-pink-forProfile' : 'border-0'}`}
                            onChange= {(e)=>{
                              const value = e.target.value.replace(/\D/g, ""); //To clear the field of any non-numerical inputs
                              if (value.length <= 10) {
                                setUserUpdate({
                                  ...userUpdate,
                                  "phone": value
                                })
                              }
                            }}
                            value = {userUpdate.phone}
                            readOnly= {!isEditMode}
                            style={{ backgroundColor: isEditMode ? "#fff" : "#F9F9F9" }} />
                          {userUpdate.phone !== "" &&(
                              <div className='mt-2' style={{ fontSize: '0.85rem' }}>
                                  {userUpdate.phone.length >= 1 && !userUpdate.phone.startsWith("09") &&(
                                      <div className='text-danger mb-1 d-flex align-items-center'><ExclamationCircle size={16} className='me-2'/> The Syrian number must start with 09</div>
                                  )}
                                  {userUpdate.phone.length < 10 &&(
                                      <div className='text-warning d-flex align-items-center'><ExclamationSquare size={16} className='me-2'/> {10 - userUpdate.phone.length} digits remaining to complete the Syrian number</div>
                                  )}
                              </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={12}>
                      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                      {!isEditMode ? (
                        <Button 
                          type="button" 
                          onClick={(e) => {e.preventDefault(); setIsEditMode(true)}} 
                          className="send-btn py-3 px-2 w-25 fw-bold border-0 shadow-sm"
                        >
                          <PencilSquare size={20} className="me-2"/>
                          Edit
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          form="profileForm"
                          disabled={isLoading}
                          className="send-btn py-3 px-2 w-25 fw-bold border-0 shadow-sm"
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      )}
                      </Col>
                    </Row>
                  </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="address">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold m-0">Manage Addresses</h4>
                  <Button variant="dark" className="send-btn border-0 px-3 shadow-sm"
                  onClick={() => handleAddClick()}>+ Add New</Button>
                  <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        {isEditAddressMode ? "Edit Address" : "Add New Address"}  
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={handleSubmit} id="addAddressForm">
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">Address Name (e.g. Home)</Form.Label>
                              <Form.Control 
                                required
                                className="shadow-none border-pink-forProfile"
                                value={addressData.name || ""}
                                onChange={(e) => setAddressData({...addressData, name: e.target.value})}
                                placeholder="Home / Office Name" 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">Phone Number</Form.Label>
                              <Form.Control 
                                required
                                value={addressData.phone || ""}
                                className="shadow-none border-pink-forProfile"
                                onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                                placeholder="09xxxxxxxx" 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">City</Form.Label>
                              <Form.Control 
                                required
                                value={addressData.city || ""}
                                className="shadow-none border-pink-forProfile"
                                onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                                placeholder="City/Town"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">Street Address</Form.Label>
                              <Form.Control 
                                required
                                value={addressData.street || ""}
                                className="shadow-none border-pink-forProfile"
                                onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                                placeholder="Street Address" 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">Neighborhood</Form.Label>
                              <Form.Control 
                                required
                                value={addressData.neighborhood || ""}
                                className="shadow-none border-pink-forProfile"
                                onChange={(e) => setAddressData({...addressData, neighborhood: e.target.value})}
                                placeholder="Neighborhood Name" 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">Building Address</Form.Label>
                              <Form.Control 
                                required
                                value={addressData.building || ""}
                                className="shadow-none border-pink-forProfile"
                                onChange={(e) => setAddressData({...addressData, building: e.target.value})}
                                placeholder="Building Address" 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small fw-bold">Zip Code</Form.Label>
                              <Form.Control
                                className="shadow-none border-pink-forProfile"
                                required
                                value={addressData.zip_code || ""}
                                onChange={(e) => setAddressData({...addressData, zip_code: e.target.value})}
                                placeholder="Zip Code" 
                              />
                            </Form.Group>
                          </Col>
                          
                        </Row>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                      <Button form="addAddressForm" type="submit" className="send-btn border-0">
                        {isLoading ? "Saving..." : (isEditAddressMode ? "Update Address" : "Save Address")}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
                <Row className="g-4">
                  {addresses.map((address) => (
                    <Col lg={6} md={12} key={address.id} className="fade-in"> 
                      <div className="card border-1  p-4 h-100 position-relative empty-state-container">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h5 className="text-dark fw-bold m-0">{address.name}</h5>
                          <button onClick={() => handleEditClick(address)} className="btn-action btn-edit">
                            <PencilFill size={14} className="me-1"/>Edit
                          </button>
                        </div>

                        <ul className="list-unstyled mb-0">
                          <li className="text-dark mb-2 d-flex align-items-center">
                            <GeoAltFill size={16} className="me-2 pink-color opacity-75" />
                            <span className="small">{address.city}, Syria</span>
                          </li>
                          <li className="text-dark mb-2 d-flex align-items-center">
                            <SignpostSplitFill size={16} className="me-2 pink-color opacity-75" />
                            <span className="small">Street: {address.street}, Neighborhood: {address.neighborhood}</span>
                          </li>
                          <li className="text-dark mb-2 d-flex align-items-center">
                            <BuildingFill size={16} className="me-2 pink-color opacity-75" />
                            <span className="small">Building: {address.building}, Zip: {address.zip_code}</span>
                          </li>
                          <li className="text-dark d-flex align-items-center mt-3 pt-2 border-top">
                            <PhoneFill size={16} className='pink-color me-2' />
                            <span className="fw-medium small">{address.phone}</span>
                          </li>
                          <li>
                            <GeoFill size={16} className='pink-color me-2' />
                            <span className="fw-medium small">Coordinates: {address.lat}, {address.lng}</span>
                          </li>
                        </ul>
                        <div className="text-end">
                          <button onClick={() => handleRemoveAddress(address.id)} disabled={deletingId !== null}
                          className="btn-action btn-delete mt-2 ">
                          {deletingId === address.id ? (

                            <Spinner animation="border" size="sm" variant="danger" />
                          ) : (
                            <Trash3Fill size={20} className={deletingId !== null ? "gray" : "me-1"}/>
                          )}
                        </button>
                        </div>
                        
                      </div>
                    </Col>
                  ))}
                  {addresses.length === 0 && (
                    <Row>
                      <Col xs={12} className="text-center py-5 my-5 fade-in">
                        <div className="empty-state-container">
                          <div className="mb-4">
                            <EmojiFrownFill className="pink-color" style={{ fontSize: '4rem', opacity: 0.8 }}/>
                          </div>
                          <h3 className="fw-bold text-dark">No addresses saved yet!</h3>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold m-0">Order History</h4>
                  <Badge bg="white " className="text-dark border px-3 py-2">
                    Total Orders: {metaOrder ? metaOrder.total : 0}
                  </Badge>
                </div>
                <Card className="border-0">
                  <Table hover responsive className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr className="text-center">
                        <th>Order ID</th>
                        <th>Grand Total</th>
                        <th>Status</th>
                        <th>Payment Status</th>
                        <th>Payment Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading orders...</p>
                          </td>
                        </tr>
                      ) : orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id} className="text-center">
                            <td className="ps-4 fw-bold text-muted">#{order.id}</td>
                            <td className="fw-medium text-dark">
                              ${Number(order.grand_total).toLocaleString()}
                            </td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              <Badge 
                                pill 
                                bg={order.payment_status === "PENDING" ? "light" : "success"} 
                                className={order.payment_status === "PENDING" ? "text-dark border" : ""}
                              >
                                {order.payment_status}
                              </Badge>
                            </td>
                            <td>
                              <small className="text-muted d-flex align-items-center justify-content-center gap-2">
                                {order.payment_type === "CASH" ? <Cash size={16} className="text-success"/> : <CreditCard size={16} className="text-primary"/>}
                                {order.payment_type}
                              </small>
                            </td>
                            <td className="text-center">
                              <button 
                                onClick={() => handleViewDetails(order.id)} 
                                className="btn-action btn-view" 
                                size="sm"
                              >
                                <Eye size={18} /> 
                              </button>
                              {order.status === "PENDING" && (
                                <button 
                                  variant="danger" 
                                  size="sm" 
                                  className="ms-2 btn-action btn-delete"
                                  onClick={() => handleCancelOrderTrigger(order.id)}
                                >
                                  <Trash3Fill />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="empty-state-container fade-in">
                              <div className="mb-4">
                                <EmojiFrownFill className="pink-color" style={{ fontSize: '4rem', opacity: 0.8 }}/>
                              </div>
                              <h3 className="fw-bold text-dark">No orders found!</h3>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card>
                <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                  <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">
                      Order Details #{selectedOrderDetails?.id}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="px-4">
                    {selectedOrderDetails ? (
                      <>
                        <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
                          <div>
                            <p className="text-muted small mb-1">Status</p>
                            {getStatusBadge(selectedOrderDetails.status)}
                          </div>
                          <div className="text-end">
                            <p className="text-muted small mb-1">Payment Method</p>
                            <span className="fw-bold text-uppercase">{selectedOrderDetails.payment_type}</span>
                          </div>
                        </div>
                        <h6 className="fw-bold mb-3 mt-4">Order Items:</h6>
                        <div className="order-items-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {selectedOrderDetails.orderProducts?.map((item) => (
                            <div key={item.id} className="d-flex align-items-center mb-3 p-2 bg-light rounded">
                              <img 
                                src={item.product?.image} 
                                alt={item.product?.name} 
                                style={{ width: '65px', height: '65px', objectFit: 'cover' }} 
                                className="rounded shadow-sm me-3"
                              />
                              
                              <div className="flex-grow-1">
                                <div className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>
                                  {item.product?.name}
                                </div>
                                <small className="text-muted d-block">
                                  SKU: {item.product?.sku}
                                </small>
                                <small className="text-dark fw-medium">
                                  Qty: {item.quantity} × 
        
                                  {item.discount > 0 && (
                                    <span className="text-decoration-line-through text-muted me-1 small">
                                      ${Number(item.base_price).toLocaleString()}
                                    </span>
                                  )}
                                  <span>${Number(item.price).toLocaleString()}</span>
                                </small>
                              </div>
                              <div className="text-end fw-bold pink-color">
                                ${Number(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedOrderDetails.coupon && (
                          <div className="my-4 p-3 border-start border-4 rounded-end shadow-sm bg-white" 
                              style={{ borderColor: '#e91e63' }}> 
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <TicketPerforated className="pink-color" size={20} />
                                  <span className="fw-bold text-dark" style={{ letterSpacing: '1px' }}>
                                    {selectedOrderDetails.coupon.code.toUpperCase()}
                                  </span>
                                  <Badge bg="none" className="ms-1" style={{ backgroundColor: '#fce4ec', color: '#e91e63' }}>
                                    -{selectedOrderDetails.coupon.discount}% OFF
                                  </Badge>
                                </div>
                                <small className="text-muted d-block">Coupon Applied Successfully</small>
                              </div>
        
                              <div className="text-end border-start ps-3">
                                <p className="text-muted small mb-1" style={{ fontSize: '0.75rem' }}>Validity Period</p>
                                <span className="fw-medium small d-flex align-items-center justify-content-end">
                                  <Calendar4Event className="me-2 pink-color" size={14} /> 
                                  <span className="text-dark">
                                    {selectedOrderDetails.coupon.from_date} 
                                    <span className="mx-2 text-muted">→</span> 
                                    {selectedOrderDetails.coupon.to_date}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="bg-light p-3 rounded shadow-sm border">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal:</span>
                            <span className="fw-medium">
                              ${Number(selectedOrderDetails.total).toLocaleString()}
                            </span>
                          </div>
        
                          {selectedOrderDetails.discount > 0 && (
                            <div className="d-flex justify-content-between mb-2 text-danger">
                              <span>
                                Coupon Discount 
                                {selectedOrderDetails.coupon && ` (${selectedOrderDetails.coupon.discount}%)`} :
                              </span>
                              <span className="fw-medium">
                                -${Number(selectedOrderDetails.discount).toLocaleString()}
                              </span>
                            </div>
                          )}
        
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Shipping:</span>
                            <span className={selectedOrderDetails.shipping === 0 ? "text-success fw-bold" : "fw-medium"}>
                              {selectedOrderDetails.shipping === 0 ? "Free" : `$${Number(selectedOrderDetails.shipping).toLocaleString()}`}
                            </span>
                          </div>
        
                          <div className="d-flex justify-content-between mt-3 pt-3 border-top border-secondary-subtle">
                            <span className="fw-bold h5 mb-0">Grand Total:</span>
                            <span className="fw-bold fs-4 pink-color mb-0">
                              ${Number(selectedOrderDetails.grand_total).toLocaleString()}
                            </span>
                          </div>
                        </div>
        
                        {selectedOrderDetails.comment && (
                          <div className="mt-3">
                            <p className="text-muted small mb-1">Comment:</p>
                            <p className="p-2 border rounded bg-white">{selectedOrderDetails.comment}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-5">Loading details...</div>
                    )}
                  </Modal.Body>
                </Modal>  
              </Tab.Pane>
              <Tab.Pane eventKey="product">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-3">
                    <h4 className="fw-bold m-0">My Products </h4>
                    <Badge bg="white " className="text-dark border px-3 py-2">
                      Total Products: {products ? products.length : 0}
                    </Badge>
                  </div>
                  <Button variant="dark" className="send-btn border-0 px-3 shadow-sm"
                  onClick={() => handleShowProductModal()}>+ Add New</Button>
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
                                className="shadow-none border-pink-forProfile"
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
                                className="shadow-none border-pink-forProfile"
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
                                className="shadow-none border-pink-forProfile"
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
                                className="shadow-none border-pink-forProfile"
                                onInput={(e) => setAddProductForm({...addProductForm, category_id: e.target.value})}
                                placeholder="Category ID" 
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                          <div className='d-flex flex-column align-items-center'>
                            <label 
                                htmlFor="image-product" 
                                className="d-flex align-items-center justify-content-center rounded-2 border border-pink-forProfile overflow-hidden bg-light"
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
                </div>
                <Card className=" border-0">
                  {products && products.length > 0 ? (
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
                        {products.map((product) => (
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
                            <td>${Number(product.price).toLocaleString()}</td>
                            <td>
                              <button 
                                size="sm" 
                                className="me-2 btn-action btn-edit"
                                onClick={()=>{handleShowProductModal(product)}}
                                disabled={isLoading}>
                                <PencilFill />
                              </button>
                              <button 
                                variant= "link"
                                size="sm" 
                                className="me-2 btn-action btn-view"
                                onClick={() => {navigate(`/products/${product.id}`)}}
                                disabled={isLoading}>
                                <EyeFill />
                              </button>
                              <button
                                size="sm" 
                                className="btn-action btn-delete"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={isLoading}
                              >
                                <Trash3Fill /> 
                              </button>
                            </td>
                          </tr>
                          ))}
                      </tbody>
                    </Table>
                      ) : (
                    <Row>
                      <Col xs={12} className="text-center py-5 my-5 fade-in">
                        <div className="empty-state-container">
                          <div className="mb-4">
                            <EmojiFrownFill className="pink-color" style={{ fontSize: '4rem', opacity: 0.8 }}/>
                          </div>
                          <h3 className="fw-bold text-dark">You didn't create a product yet!</h3>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="wishlist">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold m-0">My Wishlist</h4>
                  <Badge bg="white " className="text-dark border px-3 py-2">
                    Total Wishlist: {wishlistItems.length}
                  </Badge>
                </div>
                <WishlistContent />
              </Tab.Pane>
            </Tab.Content>
            <hr className="my-5" />
            <h6 className="mb-3 fw-bold text-muted">EXTERNAL LINKS</h6>
            <Row className="g-3">
              {settingsLinks.map((link) => (
                <Col md={4} key={link.id}>
                  <div 
                    className="d-flex justify-content-between align-items-center p-4 rounded-2 cursor-pointer"
                    style={{ backgroundColor: '#F9F9F9', transition: '0.2s' }}
                    onClick={()=>{navigate(link.path)}}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7edf4'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}>
                    <span className=" fw-medium" style={{fontSize: "16px"}}>{link.title}</span>
                    <CaretRightFill style={{ fontSize: '24px' }} className="pink-color" />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          </Col>
        </Row>
      </Tab.Container>
      <DynamicModal 
        show={modalConfig.show}
        handleClose={() => setModalConfig({ ...modalConfig, show: false })}
        handleConfirm={modalConfig.onConfirm} 
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isConfirm={modalConfig.isConfirm}
        showInput={modalConfig.showInput}
        inputValue={cancelReason}
        setInputValue={setCancelReason}
      />
    </div>
    );
}

export default Profile