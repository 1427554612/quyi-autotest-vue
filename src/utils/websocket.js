export default class SocketService {
    
    constructor(againConnect = true, url) {
      this.url = url;
      this.againConnect = againConnect;
      this.dealData=null
      //数据处理函数
    }
    instance = null;  //页面中使用的SocketService实例
    ws = null; // 和服务端连接的socket对象
    url; //地址
    againConnect;     //断开是否重连
    connected = false; // 标识是否连接成功
    sendRetryCount = 0; // 记录重试的次数
    connectRetryCount = 0; // 重新连接尝试的次数
    
    //单例模式保证只有一个SocketService实例
    static get Instance() {
      if (!this.instance) {
        let base_url = process.env.VUE_APP_BASE_API
        base_url = base_url.substring(7,base_url.length)
        this.url = "ws://" + base_url+`/websocket/9527`
        // console.log("websocket地址：" + this.url)
        this.instance = new SocketService(false, this.url);
      }
      return this.instance;
    }
    
    //  定义连接服务器的方法
    connect() {
      // 这里判断你的浏览器支不支持websocket
      if (!window.WebSocket) {
        return console.log("您的浏览器不支持WebSocket");
      }
      this.ws = new WebSocket(this.url);
      
      //连接上了
      this.ws.onopen = () => {
        this.connected = true;
        // 重置重新连接的次数
        this.connectRetryCount = 0;
      };

        //连接关闭了，设置标识值为false，
      this.ws.onclose = () => {
        this.connected = false;
        this.connectRetryCount++;
        if (this.againConnect) {
          setTimeout(() => {
            this.connect();
          }, 500 * this.connectRetryCount);
        } else {
          sessionStorage.clear();
          localStorage.clear();
          message.error("登录超时");
          router.push("/");
        }
      };
      
      // 连接失败
      this.ws.onerror = () => {
        console.log("socket连接失败");
        this.connected = false;
        this.connectRetryCount++;
        if (this.againConnect) {
          setTimeout(() => {
            this.connect();
          }, 500 * this.connectRetryCount);
        }
      };
    
      // 收到消息
      this.ws.onmessage = (e) => {
        // this.datas.push(e.data)
        this.dealData && this.dealData(e.data)
        // let { payload, requestId } = JSON.parse(e.data);
        // if (this.subscribeList[requestId]) {
        //     this.subscribeList[requestId].forEach((item) =>
        //       item.call(this, payload)
        //     );
        //   }
      };
    }
    //销毁回调函数
    unSubscribe() {
      //停止消息发送
      this.idList.forEach((item) => {
        this.send({ id: item, type: "unsub" });
        delete this.subscribeList[item];
      });
      this.idList = [];
      this.datas = [] // 销毁数据
    }

    subscribeList = {}; //记载回调函数
    idList = [];
    
    
    // 发送数据的方法
    send(data, callback,dealdata) {
        console.log(dealdata)
        if(dealdata) this.dealData = dealdata
      
        //判断此时有没有ws
      if (!this.ws) {
        this.connect();
        this.send(data, callback);
      } else {
        // 判断此时此刻有没有连接成功
        if (this.connected) {
          this.sendRetryCount = 0;
          this.ws.send(JSON.stringify(data));
          if (data.type === "sub") {
            //存储id
            this.idList.push(data.id);
            //存储回调函数,
            if (!this.subscribeList[data.id]) {
              this.subscribeList[data.id] = [callback];
            } else {
              this.subscribeList[data.id].push(callback);
            }
          }
        } else {
          this.sendRetryCount++;
          setTimeout(() => {
            this.send(data, callback);
          }, this.sendRetryCount * 500);
        }
      }
    }
  }