const axios = require('axios');
require('dotenv').config();
const host = process.env.HOST 
const serverURL = "http://" + host + ":8181/v1/data"

const get_opa_decision  = async function(userEmail) {
    

    const data_input = {
        input: {
            domain:userEmail
        }
    }
    
   return axios({
        method: 'post',
        url: serverURL,
        data: data_input
      })
    
}


module.exports = get_opa_decision 

