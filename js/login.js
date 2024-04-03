(function () {
  //各种文本框的验证规则

  //用户名
  var LoginDom = new FieldValidator('txtLoginId', async function (val) {//该验证函数返回的是错误消息
    //val为文本框的值
    // console.log(val);
    if (!val) {
      return '用户名不能为空'
    }
  })

  //密码
  var TxtLoginPwdDom = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
      return '密码不能为空'
    }
  })

  const form = $('.user-form')
  form.onsubmit = async function (e) {
    e.preventDefault()
    const result = await FieldValidator.validate(LoginDom, TxtLoginPwdDom)
    // console.log(result);
    if (!result)
      return//验证未通过
    // const data = await API.reg({
    //   "loginId": LoginDom.input.value,
    //   "nickname": NicknameDom.input.value,
    //   "loginPwd": TxtLoginPwdDom.input.value,
    // })
    //或者用这种方式来拿到表单对象的信息
    const formData = new FormData(form)//里边传入表单dom，获得一个表单数据对象
    const data = Object.fromEntries(formData.entries())
    // console.log(data)
    const resp = await API.login(data)
    if (resp.code === 0) {
      alert('登录成功')
      location.href = './index.html'
    }
    else {
      LoginDom.p.innerText = '账号或密码错误'
      LoginDom.input.value = ''
      TxtLoginPwdDom.input.value = ''
    }
  }

})()