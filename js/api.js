var API = (function () {
  const BASE_URL = 'https://study.duyiedu.com'
  const LOCAL_TOKEN = 'token'

  //每次的get请求都要把本地的token放入请求头
  //get请求不能有请求体
  //返回get请求的promise对象
  function get(path) {
    //因为get请求时获取信息，所以Content-Type可以不用写
    const headers = {}
    const token = localStorage.getItem(LOCAL_TOKEN)
    //如果token存在，把它加到请求头里
    if (token) {
      headers.authorization = `Bearer ${token}`
    }
    //get请求也可以不用写method，浏览器
    return fetch(BASE_URL + path, { headers, method: 'GET' })
  }

  //每次的post请求都要把本地的token放入请求头
  //post请求是提交信息，可以有请求体
  //返回post请求的promise对象
  function post(path, bodyObj) {
    const headers = {
      //需要写入Content-Type，表示提交的请求体信息是json形式
      'Content-Type': 'application/json',
    }
    const token = localStorage.getItem(LOCAL_TOKEN)
    //如果token存在，把它加到请求头里
    if (token) {
      headers.authorization = `Bearer ${token}`
    }
    return fetch(BASE_URL + path, {
      headers,
      //需要手动规定method为post
      method: 'POST',
      body: JSON.stringify(bodyObj)
    })
  }

  //用户注册请求
  async function reg(userInfor) {
    const resp = await post('/api/user/reg', userInfor)
    return await resp.json()
  }

  //用户登录请求
  async function login(loginInfor) {
    const resp = await post('/api/user/login', loginInfor)
    //先将响应的内容保存起来
    const result = await resp.json()
    //如果登录成功，将authorization里的内容保存到本地
    if (result.code === 0) {
      //获取响应头里键的值
      const token = resp.headers.get('authorization')
      localStorage.setItem(LOCAL_TOKEN, token)
    }
    //如果没有登录成功，直接返回result
    return result
  }

  //判断用户是否存在
  async function exists(loginId) {
    const resp = await get('/api/user/exists?loginId=' + loginId)
    return await resp.json()
  }

  //获取用户信息---返回get请求的promise对象
  async function profile() {
    //result表示得到响应头
    const result = await get('/api/user/profile')
    //result.json()表示得到响应体
    return await result.json()
  }

  //发送聊天信息---content为对象，示例：{"content": "string"}
  async function sendChat(content) {
    const resp = await post('/api/chat', { content, })
    return await resp.json()
  }

  //得到历史聊天记录
  async function getHistory() {
    const resp = await get('/api/chat/history')
    return await resp.json()
  }

  //退出登录
  function loginOut() {
    localStorage.removeItem(LOCAL_TOKEN)
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  }
})()
