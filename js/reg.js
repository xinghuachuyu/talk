(function () {
  //各种文本框的验证规则

  //用户名
  var LoginDom = new FieldValidator('txtLoginId', async function (val) {//该验证函数返回的是错误消息
    //val为文本框的值
    // console.log(val);
    if (!val) {
      return '用户名不能为空'
    }
    //如果没有错，判断用户名是否存在
    //因为exists函数是异步的，所以需要等待exists函数
    const resp = await API.exists(val)
    if (resp.data) {
      return '用户名已存在'
    }
  })

  //昵称
  var NicknameDom = new FieldValidator('txtNickname', function (val) {
    if (!val) {
      return '昵称不能为空'
    }
  })

  //密码
  var TxtLoginPwdDom = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
      return '密码不能为空'
    }
  })

  //再次确认密码
  var TxtLoginPwdConfirmDom = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
      return '密码不能为空'
    }
    if (val !== TxtLoginPwdDom.input.value) {
      return '两次输入的密码不一致'
    }
  })

  // $('.user-form')
  const form = $('.user-form')
  form.onsubmit = async function (e) {
    e.preventDefault()
    const result = await FieldValidator.validate(LoginDom, NicknameDom, TxtLoginPwdDom, TxtLoginPwdConfirmDom)
    console.log(result);
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
    const resp = await API.reg(data)
    if (resp.code === 0) {
      alert('注册成功')
      location.href = './login.html'
    }

  }

})()