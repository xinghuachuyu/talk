// 用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
  * 构造器
  * @param {String} txtId 文本框的Id,可以用它来获取dom对象
  * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
  */
  constructor(txtId, validatorFunc) {
    //将获取到的对象保存到this中
    this.input = document.querySelector('#' + txtId)
    this.p = this.input.nextElementSibling
    //保存规则函数
    this.validatorFunc = validatorFunc
    // console.log(this.input, this.p);
    //焦点改变时，表达提交的验证
    this.input.onblur = () => {
      //这里的this指向的是this.input的this，即FieldValidator
      // console.log(this);
      this.validate()
    }
  }
  //原型上的validate函数--表单提交时的验证--成功返回true，失败返回false--返回布尔值是为了之后的提交判断
  //原型函数需要通过实例来调用
  async validate() {//调用验证规则函数--validatorFunc
    //err用来保存错误信息
    const err = await this.validatorFunc(this.input.value)
    if (err) {
      //如果有错误
      this.p.innerText = err
      return false
    }
    else {
      //还须再把p的内容重新赋值为''
      this.p.innerText = ''
      return true
    }
  }

  //静态方法，可以直接通过类来调用，不需要再通过实例去调用
  /**
   * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
   * 是为了避免刚进入页面就直接点注册的情况
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    //proms保存的是一个数组,里边是每一个实例调用原型上的validate方法返回的布尔值[true,false...]
    const proms = validators.map((item) => item.validate())
    //result 是用来等待proms里的所有实例（调用的异步validate函数）任务成功；若全部成功，则返回成功的任务数组--[true,false...]
    const result = await Promise.all(proms)
    //该函数返回的是 实例是否全部为true的布尔值
    return result.every((t) => t)
  }
}

