import { api_config } from "../Config/API";

const base_url = api_config.BASE_URL
const loginPath = api_config.ENDPOINTS.LOGIN
const verifyPath = api_config.ENDPOINTS.VERIFY
const resendPath = api_config.ENDPOINTS.RESEND
const registerPath = api_config.ENDPOINTS.REGISTER
const updateProfile = api_config.ENDPOINTS.PROFILE
const contactUs = api_config.ENDPOINTS.CONTACT_US

export const AuthServices = {
  login: function(phoneInfo){
    return fetch(`${base_url}${loginPath}`,{
      method: "POST",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        "Accept-Language": "en"
      },
      body: JSON.stringify(phoneInfo)
    })
    .then(res => this.handleResponse(res))
  },
  verify: function(OtpPayLoad){
    return fetch( `${base_url}${verifyPath}` , {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Accept-Language": "ar"
            },
            body: JSON.stringify(OtpPayLoad)
        })
        .then(res => this.handleResponse(res))
  },
  resend: function(OtpPayLoad){
    return fetch( `${base_url}${resendPath}` , {
      method: "POST",
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "ar"
      },
      body: JSON.stringify({"phone": OtpPayLoad.phone })
    })
    .then(res => this.handleResponse(res))
  },
  register: function(registerData){
    const formData = this.prepareFormData(registerData);
    return this.handleAuthRequest(`${base_url}${registerPath}`, "POST", formData);
  },
  getProfile: function(token){
    return  fetch(`${base_url}${updateProfile}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => this.handleResponse(res))
  },
  update_profile: function(token, newName){
    return fetch( `${base_url}${updateProfile}` , {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "en",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({"name": newName })
    })
    .then(res => this.handleResponse(res))
  },
  contactUs: function(contactForm){
    return fetch( `${base_url}${contactUs}` , {
      method: "POST",
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "en"
      },
      body: JSON.stringify({"name": contactForm.name,
                          "email": contactForm.email,
                          "type": contactForm.type,
                          "message": contactForm.message,})
    })
    .then(res => this.handleResponse(res))
  },
  prepareFormData: function(data) {
    const formData = new FormData();
    formData.append("name", data.name )
    formData.append("email", data.email )
    formData.append("phone", data.phone )
    
    if (data.image instanceof File) {
        formData.append('image', data.image);
    }
    return formData;
  },
  handleAuthRequest: function(url, method, body) {
    return fetch(url, {
      method: method,
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en"
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
} 
