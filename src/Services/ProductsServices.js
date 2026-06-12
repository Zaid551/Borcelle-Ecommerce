import { api_config } from "../Config/API"

const base_url = api_config.BASE_URL
const productPath = api_config.ENDPOINTS.PRODUCT
export const ProductService = { 
  getAllProducts: function(filters = {}) {
    const { page = 1, limit = 15, categoryId, minPrice, maxPrice, token, mine, search } = filters;
    
    let url = `${base_url}${productPath}?page=${page}&per_page=${limit}`
    if (categoryId) url += `&category_id=${categoryId}`;
    if (minPrice !== undefined) url += `&min_price=${Number(minPrice)}`;
    if (maxPrice !== undefined) url += `&max_price=${Number(maxPrice)}`;
    if (mine) url += `&mine=${mine}`;
    if (search) url += `&search=${search}`;
    return fetch(url,{
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
        "Accept-Language": "en"
      }
    })
      .then(res => this.handleResponse(res))
  },
  getProductById: function(id) {
    return fetch(`${base_url}${productPath}/${id}`)
    .then(res => this.handleResponse(res));
  },
  deleteProductById: function(id, token){
    return fetch(`${base_url}${productPath}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(res => this.handleResponse(res))
  },
  addProduct: function(productData, token) {
    const formData = this.prepareFormData(productData);
    return this.sendProductRequest(`${base_url}${productPath}`, "POST", formData, token);
  },
  updateProduct: function(productId, productData, token) {
    const formData = this.prepareFormData(productData);
    formData.append('_method', 'PUT'); 
    return this.sendProductRequest(`${base_url}${productPath}/${productId}`, "POST", formData, token);
  },
  prepareFormData: function(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category_id', data.category_id);
    
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    return formData;
  },
  sendProductRequest: function(url, method, body, token) {
    return fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body
    })
    .then(res => this.handleResponse(res));
  },
  handleResponse: async function(res) {
    const data = await res.json();
    if(!res.ok){
      return res.json().then((serverError)=>{
        throw new Error (serverError || 'Something went wrong!')
      })
    }
    return data;
  }
};