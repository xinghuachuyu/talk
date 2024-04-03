(async function () {
  //必须通过profile()验证是否已经登录
  const resp = await API.profile()
  const user = resp.data//如果没有登录，data会为null,user--false,!user---true
  // console.log(user, !user);
  //通过user判断有没有用户登录
  if (!user) {
    //未登录,即user--false, !user---true
    alert('未登录，请先登录！')
    location.href = './login.html'
    return
  }
  //下面一定是登录状态下
  const doms = {
    aside: {
      loginId: $('#loginId'),
      nickname: $('#nickname')
    },
    closed: {
      close: $(".close")
    },
    chatObj: {
      obj: $(".chat-container")
    },
    btn: $('.msg-container button'),
    input: $('#txtMsg'),
    form: $(".msg-container")
  }
  setUser()
  //设置用户信息
  function setUser() {
    //注意要使用innerText,不能使用innerHTML,避免用户输入不标准的信息
    doms.aside.loginId.innerText = user.nickname
    doms.aside.nickname.innerText = user.loginId
  }
  await addHistery()
  //加载历史信息
  async function addHistery() {
    const mes = await API.getHistory()
    console.log(mes.data);
    //用for of循环遍历数组
    for (const item of mes.data) {
      addChat(item)
    }
    //或者用for循环遍历数组
    // for (let i = 0; i < mes.data.length; i++) {
    //   addChat(mes.data[i])
    // }
    scrollBottom()
  }
  //退出功能，注册事件
  doms.closed.close.addEventListener('click', function () {
    API.loginOut()
    location.href = "./login.html"
  })
  /**
   * chatInfor为消息对象，示例： 
   * {
    content: "string",
    createdAt: 1711946888959,
    from: "haha233",
    to: null
    }
   */
  //发送聊天函数
  function addChat(chatInfor) {
    const div = $$$('div')
    div.classList.add('chat-item')
    //通过from判断是谁发的消息--为null表示是机器人--false; 不为null，表示为用户---true
    if (chatInfor.from) {
      div.classList.add('me')
    }
    //图片
    const img = $$$('img')
    img.classList.add('chat-avatar')
    img.src = chatInfor.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg"
    //聊天消息
    const content = $$$('div')
    content.classList.add('chat-content')
    content.innerText = chatInfor.content
    //日期时间
    const date = $$$("div")
    date.classList.add('chat-date')
    date.innerText = toDate(chatInfor.createdAt)

    div.appendChild(img)
    div.appendChild(content)
    div.appendChild(date)
    doms.chatObj.obj.appendChild(div)
  }

  //将时间戳转为标志日期格式
  function toDate(timestemp) {
    const date = new Date()
    const year = date.getFullYear()
    //padStart(位数，想要填充的字符串)---用来填充
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDay().toString().padStart(2, '0')

    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  //设置滚动条滚到最下面
  function scrollBottom() {
    doms.chatObj.obj.scrollTop = doms.chatObj.obj.scrollHeight
    // console.log(doms.chatObj.obj.scrollTop, doms.chatObj.obj.scrollHeight);
  }

  //发送消息函数
  async function sendInfor() {
    //先发送用户的消息，再等服务器响应
    const mes = doms.input.value.trim()
    console.log(mes);
    if (!mes) {
      return
    }
    //用户发的
    addChat({
      content: mes,
      createdAt: Date.now(),
      from: user.loginId,
      to: null,
    })
    scrollBottom()
    doms.input.value = ''
    //服务器响应拿到响应的promise对象
    const resp = await API.sendChat(mes)
    console.log(resp);
    //再添加响应的结果---机器人回的
    addChat({
      from: null,
      to: user.loginId,
      //展开resp.data对象
      ...resp.data
    })
    scrollBottom()
  }
  window.sendInfor = sendInfor
  //绑定发送消息事件
  doms.form.addEventListener('submit', function (e) {
    e.preventDefault()
    //form表单里的button就是用来提交表单的按钮
    sendInfor()
  })

})()