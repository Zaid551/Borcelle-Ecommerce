import React, { useState, useEffect } from 'react';
import { Table, Badge, Card, Dropdown, Spinner, Modal } from 'react-bootstrap'; 
import { Eye, TicketPerforated, Calendar4Event, Cash, CreditCard, Trash3Fill } from 'react-bootstrap-icons';
import DynamicModal from '../../Components/DynamicModal';

const ManageOrders = () => {
  const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
  const token = getToken()
  const [orders, setOrders] = useState([]);
  const [metaOrder, setMetaOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  /// Order View Details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [modalConfig, setModalConfig] = useState({
      show: false,
      title: '',
      message: '',
      type: 'success',
      isConfirm: false
    });
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api";
  const orderPath = "/order"; 

  const callOrderApi = (page = 1) => {
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
            throw new Error(serverError.message || 'Something went wrong!');
          });
        }
        return res.json();
      })
      .then(data => {
        if (data.data) {
          const savedStatuses = JSON.parse(localStorage.getItem('fakeOrderStatuses')) || {};
          const updatedOrders = data.data.map(order => {
            if (savedStatuses[order.id]) {
              return { ...order, status: savedStatuses[order.id] };
            }
            return order;
          });

          setOrders(updatedOrders);
          setMetaOrder(data.meta);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    callOrderApi();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "warning",
      COMPLETED: "success",
      CANCELLED: "danger",
      SHIPPED: "info"
    };
    return <Badge bg={styles[status] || "secondary"}>{status}</Badge>;
  };

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
  .catch(err => console.log(err.message))
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
  if (!cancelReason.trim()) {
        return;
    }
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
const handleUpdateStatus = (orderId, newStatus) => {
  setOrders(prev => prev.map(order => 
    order.id === orderId ? { ...order, status: newStatus } : order
  ));
  const savedStatuses = JSON.parse(localStorage.getItem('fakeOrderStatuses')) || {};
  savedStatuses[orderId] = newStatus;
  localStorage.setItem('fakeOrderStatuses', JSON.stringify(savedStatuses));
  setModalConfig({
    show: true,
    title: "Success",
    message: `Order #${orderId} status updated to ${newStatus} (Locally Saved)`,
    type: "success",
    isConfirm: false
  });
};
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Orders Management</h3>
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
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <button 
                        onClick={() => handleViewDetails(order.id)} 
                        className="btn-action btn-view"
                      >
                        <Eye size={18} /> 
                      </button>
                      {order.status !== "CANCELLED" && (
                        <Dropdown onSelect={(status) => handleUpdateStatus(order.id, status)}>
                          <Dropdown.Toggle variant="outline-secondary" size="sm" className="px-2 py-1">
                            Update
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Header>Change Status to:</Dropdown.Header>
                            <Dropdown.Item eventKey="SHIPPED">Shipped</Dropdown.Item>
                            <Dropdown.Item eventKey="COMPLETED">Completed</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="PENDING">Back to Pending</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                      {order.status === "PENDING" && (
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => handleCancelOrderTrigger(order.id)}
                        >
                          <Trash3Fill size={16} />
                        </button>
                      )}
                    </div>
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
      </Card>
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
};

export default ManageOrders;