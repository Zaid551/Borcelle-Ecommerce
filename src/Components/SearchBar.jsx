import React from 'react'
import { Form, NavDropdown, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { Search } from 'react-bootstrap-icons';

export const SearchBar = ({input, setInput, setShowResults, setResults, variant}) => {
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categorySelected, setCategorySelected] = useState({id: null, name: "All category"})
  const base_url = "https://training.tamkeen-dev.com/tamkeenstore/public/api"
  const categoryPath = "/category"
  const productPath = "/product"
  const callCategoryApi = () =>{
    fetch(`${base_url}${categoryPath}`)
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
        const validCategories = data.data.filter(cat => cat.name !== null);
        setCategories(validCategories);
      }
    })
    .catch((err)=>{
        console.error("Error fetching data:", err);
    })
    .finally(()=>{
        console.log("API Call Ended!!!!")
    })
  }
  const callProductApi = () => {
    fetch(`${base_url}${productPath}?page=1`)
    .then(res => {
      if(!res.ok){
        return res.json().then((serverError)=>{
          throw new Error (serverError || 'Something went wrong!')
        })
      }
      return res.json()
    })
    .then((firstData) => {
      if (firstData.code === 1) {
        let allFetchedProducts = firstData.data;
        const lastPage = firstData.meta.last_page;
        if (lastPage > 1) {
          const remainingPagesRequests = [];
          for (let i = 2; i <= lastPage; i++) {
            remainingPagesRequests.push(
              fetch(`${base_url}${productPath}?page=${i}`).then(res => res.json())
            );
          }
          return Promise.all(remainingPagesRequests)
            .then((responses) => {
              responses.forEach((res) => {
                if (res.code === 1) {
                  allFetchedProducts = [...allFetchedProducts, ...res.data];
                }
              });
              return allFetchedProducts; 
            });
        }
        return allFetchedProducts; 
      }
    })
    .then((finalResults) => {
      console.log("Total Products Fetched:", finalResults.length);
      setAllProducts(finalResults); 
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    })
    .finally(() => {
      console.log("API Call Ended!!!!");
    });
};
useEffect(() => {
  handleSearchAndFilter(input, categorySelected.id);
}, [input, categorySelected, allProducts]); 

const handleSearchAndFilter = (text, categoryId) => {
  if (allProducts.length === 0) return;

  const results = allProducts.filter(product => {
    const matchesName = text 
      ? product.name?.toLowerCase().includes(text.toLowerCase()) 
      : true;
    
    const matchesCategory = categoryId 
      ? product.category.id === categoryId 
      : true;

    return matchesName && matchesCategory;
  });

  setResults(results);
};
  useEffect(() => {
    callProductApi();
    callCategoryApi();
  }, []);
  const handleBlur = () => setTimeout(() => setShowResults(false), 200);
  return (
    variant === "primary" ? (
      <Form onSubmit={(e) => e.preventDefault()} className="d-flex search-bar rounded-2 p-1 w-100">
        <Form.Group className='d-flex w-100' style={{boxShadow: "none", border: "1px solid #F0345D", borderRadius: "8px 0 0 8px"}}>
          <span className="input-group-text bg-transparent border-0 pe-2">
            <Search className='gray fw-bold' style={{ fontSize: '1.5rem'}} />
          </span>
          <Form.Control
            type="search"
            placeholder="Search products..."
            value={input}
            aria-label="Search"
            className="border-0 shadow-none"
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={handleBlur}
          />
        </Form.Group>
        <NavDropdown
          title={categorySelected.name}
          id="offcanvasNavbarDropdown-expand-"
          className='allCat border-start-0 border-end-0'>
          <NavDropdown.Item onClick={()=>{setCategorySelected({id: null, name: "All category"})}}>All category</NavDropdown.Item>
          <NavDropdown.Divider />
          {categories.map((cat) => (
            <NavDropdown.Item key={cat.id} onClick={()=>{setCategorySelected({id: cat.id, name: cat.name})}} >
              {cat.name}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
        <Button type="submit" className='btn-nonHover but-search pink-bg text-white border-0' style={{borderRadius: "0 8px 8px 0"}}>
            Search
        </Button>
      </Form>)
    : (
    <Form className="d-flex search-bar  rounded-2 p-1">
      <Form.Group  className="bg-light w-100">
        <div className='d-flex align-items-center flex-nowrap p-2' style={{ border: '1px solid #DEE2E7', borderRadius: '6px', overflow: 'hidden' }}>
          <span className="input-group-text bg-transparent border-0 pe-2">
            <Search className='gray fw-bold' style={{ fontSize: '1.5rem'}} />
          </span>
          <Form.Control
            type="search"
            placeholder="Search..."
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            onFocus={()=> setShowResults(true)}
            onBlur={handleBlur}
            aria-label="Search"
            className="border-0 bg-transparent shadow-0"
            style={{boxShadow: "none"}}
          />
        </div>
      </Form.Group>
    </Form>)
  )
}
