function a(callback) {
    console.warn(callback)
    console.log("调用回调函数");
    callback&&callback();  // 调用回调
  }
  function b() {
    console.log("我是回调函数b");
  }
  function c() {
    console.log("我是回调函数c");
  }
  function test() {
    a(b);
    a(c);
  }

test()