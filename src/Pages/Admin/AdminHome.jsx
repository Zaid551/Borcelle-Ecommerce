import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Table } from 'react-bootstrap';
import {  CartCheckFill, PeopleFill, BoxFill, BookmarksFill} from 'react-bootstrap-icons';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
const AdminHome = () => {
const [data, setData] = useState({
    products: [],
    orders: [],
    categories: [],
    loading: true
  });

  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api";
const getToken = () => {
    const parsedData = JSON.parse(localStorage.getItem('userData'));
    return parsedData?.data?.token;
  };
useEffect(() => {
  const token = getToken();
  const requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  fetch(`${base_url}/product`, requestOptions)
    .then(res => res.json())
    .then(data => {
      const totalProducts = data.meta?.total || data.data?.length || 0;
      setData(prev => ({ ...prev, totalProductsCount: totalProducts, products: data.data }));
    })
    .catch(err => console.error("Products Fetch Error:", err));
  fetch(`${base_url}/order`, requestOptions)
    .then(res => res.json())
    .then(data => {
      const totalOrders = data.meta?.total || 0;
      setData(prev => ({ ...prev, totalOrdersCount: totalOrders, orders: data.data }));
    })
    .catch(err => console.error("Orders Fetch Error:", err));
  fetch(`${base_url}/category`, requestOptions)
    .then(res => res.json())
    .then(data => {
      setData(prev => ({ 
        ...prev, 
        categories: data.data || [], 
        loading: false 
      }));
    })
    .catch(err => console.error("Categories Fetch Error:", err));

}, []);
  if (data.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

const categoryStats = data.categories.map(cat => {
  const count = data.products.filter(p => {
    const pCatId = p.category?.id || p.category_id;
    return Number(pCatId) === Number(cat.id);
  }).length;

  return {
    name: cat.name,
    value: count
  };
}).filter(item => item.value > 0);

const salesStats = data.orders && data.orders.length > 0 
  ? data.orders.reduce((acc, order) => {
      const status = order.status || 'UNKNOWN';
      const total = parseFloat(order.grand_total) || 0; 
      
      const existing = acc.find(item => item.name === status);
      if (existing) {
        existing.sales += total;
      } else {
        acc.push({ name: status, sales: total });
      }
      return acc;
    }, [])
  : [];

  const COLORS = ['#f81f4e', '#190505', '#555', '#F0345D','#F0728D', "#EA088B"];

const stats = [
  { title: "Total Products", value: data.totalProductsCount || 0, icon: <BoxFill/> },
  { title: "Total Categories", value: data.categories.length, icon: <BookmarksFill/> },
  { title: "Total Orders", value: data.totalOrdersCount || 0, icon: <CartCheckFill/> },
  // { title: "Customers", value: "1,250", icon: <PeopleFill/>}
];


  return (
    <div className="p-2">
      <h3 >Dashboard Overview</h3>
      <Row className="g-4 mb-5 mt-2">
        {stats.map((stat, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className="blog-card border-0 shadow-sm p-3 h-100 bg-white rounded-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">{stat.title}</p>
                  <h4 className="fw-bold mb-0">{stat.value}</h4>
                </div>
                <div className="pink-color fs-2">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 rounded-4 bg-white">
            <h5 className="fw-bold mb-4">Revenue by Order Status</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={salesStats.length > 0 ? salesStats : [{name: 'Waiting...', sales: 0}]}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dd1818" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#dd1818" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#dd1818" fill="url(#colorSales)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 rounded-4 bg-white h-100">
            <h5 className="fw-bold mb-4">Products per Category</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Products`, `${categoryStats}`]} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;