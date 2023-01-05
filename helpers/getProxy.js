const axios = require("axios");

const getNewProxy = async (apikey) => {
  try {
    const result = await axios.post(
      `https://tmproxy.com/api/proxy/get-new-proxy`,
      {
        api_key: "71889ca63bf5c9380431d2af7ec0b9da",
        sign: "string",
        id_location: 0,
      }
    );
    const proxy = result.data;
    console.log(result);
    if (result.code == 0) {
      return proxy;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const getCurrentProxy = async () => {
  try {
    const result = await axios.post(
      `https://tmproxy.com/api/proxy/get-current-proxy`,
      {
        api_key: process.env.API_KEY_TM_PROXY,
      }
    );
    const proxy = result.data;
    console.log(result.data);
    if (result.code == 0) {
      return proxy;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const getProxy = async (apikey) => {
  let result = await axios.post(`https://tmproxy.com/api/proxy/get-new-proxy`, {
    api_key: apikey,
    sign: "string",
    id_location: 0,
  });
  if (result.data.code == 5) {
    result = await axios.post(
      `https://tmproxy.com/api/proxy/get-current-proxy`,
      {
        api_key: apikey,
      }
    );
  }
  return result.data.data;
};

const getProxyList = async () => {
  const keyList = [
    "38d1bfc7394a7d33d719665741177107",
    "f9807d0d44972a8d24aaf01625566b49",
    "2471479acd01c7bc5b77ba40bb1ac544",
  ];
  let proxyList = [];
  let promisProxy = keyList.map(async (item) => {
    let i = await getProxy(item);
    return i;
  });
  proxyList = await Promise.all(promisProxy).then((data) => data);
  // proxyList.map((item,index) =>{
  //     if(item.https == ''){
  //         proxyList.splice(index,1);
  //     }
  // })
  let proxyAlive = proxyList.filter((item) => {
    return item.https != "";
  });
  return proxyAlive;
};

exports.getNewProxy = getNewProxy;
exports.getProxyList = getProxyList;
exports.getCurrentProxy = getCurrentProxy;

getProxyList();
