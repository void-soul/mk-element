'use strict';

function __extends(d, b) {
  for (let p in b) {
    if (b.hasOwnProperty(p)) d[p] = b[p];
  }

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype,
    new __());
}

/**
 * 上传任务
 */
let BaseTask = (function() {
  function BaseTask(file) {
    this._retry = 0; // 已重试次数
    this._progress = 0; // 任务进度,最大100
    this._isSuccess = false; // 是否上传成功
    this._isFinish = false; // 是否结束
    this._file = file;
    this._createDate = new Date();
  }

  Object.defineProperty(BaseTask.prototype, 'file', {
    get: function() {
      return this._file;
    },
    set: function(file) {
      this._file = file;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'retry', {
    get: function() {
      return this._retry;
    },
    set: function(value) {
      this._retry = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'createDate', {
    get: function() {
      return this._createDate;
    },
    set: function(value) {
      this._createDate = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'startDate', {
    get: function() {
      return this._startDate;
    },
    set: function(value) {
      this._startDate = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'endDate', {
    get: function() {
      return this._endDate;
    },
    set: function(value) {
      this._endDate = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'isSuccess', {
    get: function() {
      return this._isSuccess;
    },
    set: function(value) {
      this._isSuccess = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'progress', {
    get: function() {
      return this._progress;
    },
    set: function(value) {
      this._progress = Math.min(Math.max(0, value), 100);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'result', {
    get: function() {
      return this._result;
    },
    set: function(value) {
      this._result = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'error', {
    get: function() {
      return this._error;
    },
    set: function(value) {
      this._error = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'key', {
    get: function() {
      return this._key;
    },
    set: function(value) {
      this._key = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, 'isFinish', {
    get: function() {
      return this._isFinish;
    },
    set: function(value) {
      this._isFinish = value;
    },
    enumerable: true,
    configurable: true
  });
  return BaseTask;
}());

/**
 * 直传任务
 */
let DirectTask = (function(_super) {
  __extends(DirectTask, _super);

  function DirectTask() {
    const re1 = _super !== null && _super.apply(this, arguments);
    return re1 || this;
  }

  return DirectTask;
}(BaseTask));

/**
 * 分块任务
 */
let ChunkTask = (function(_super) {
  __extends(ChunkTask, _super);

  /**
   * 构造函数
   * @param file
   * @param blockSize 块大小
   * @param chunkSize 片大小
   */
  function ChunkTask(file, blockSize, chunkSize) {
    let _this = _super.call(this, file) || this;
    // 分块
    _this._blocks = [];
    _this._blockSize = 0;
    _this._chunkSize = 0;
    _this._blockSize = blockSize;
    _this._chunkSize = chunkSize;
    _this.spliceFile2Block();
    return _this;
  }

  /**
   * 将文件分块
   */
  ChunkTask.prototype.spliceFile2Block = function() {
    this._blocks = [];
    let fileSize = this._file.size;
    let file = this._file;
    // 总块数
    let blockCount = Math.ceil(fileSize / this._blockSize);
    for (let i = 0; i < blockCount; i++) {
      let start = i * this._blockSize; // 起始位置
      let end = start + this._blockSize; // 结束位置
      // 构造一个块实例
      let block = new Block(start, end, file.slice(start, end), this._chunkSize,
        file);
      // 添加到数组中
      this._blocks.push(block);
    }
  };
  Object.defineProperty(ChunkTask.prototype, 'blocks', {
    /**
     * 获取所有的block
     * @returns {Block[]}
     */
    get: function() {
      return this._blocks;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ChunkTask.prototype, 'processingBlock', {
    /**
     * 获取正在处理的block
     * @returns {Block}
     */
    get: function() {
      for (let _i = 0, _a = this._blocks; _i < _a.length; _i++) {
        let block = _a[_i];
        if (!block.processing) {
          continue;
        }
        return block;
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ChunkTask.prototype, 'finishedBlocksSize', {
    get: function() {
      let size = 0;
      for (let _i = 0, _a = this._blocks; _i < _a.length; _i++) {
        let block = _a[_i];
        size += (block.isFinish ? block.data.size : 0);
      }
      return size;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ChunkTask.prototype, 'chunks', {
    get: function() {
      let array = [];
      for (let _i = 0, _a = this._blocks; _i < _a.length; _i++) {
        let block = _a[_i];
        for (let _b = 0, _c = block.chunks; _b < _c.length; _b++) {
          let chunk = _c[_b];
          array.push(chunk);
        }
      }
      return array;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ChunkTask.prototype, 'processingChunk', {
    /**
     * 获取正在处理的chunk
     * @returns {Block}
     */
    get: function() {
      for (let _i = 0, _a = this._blocks; _i < _a.length; _i++) {
        let block = _a[_i];
        if (!block.processing) {
          continue;
        }
        for (let _b = 0, _c = block.chunks; _b < _c.length; _b++) {
          let chunk = _c[_b];
          if (!chunk.processing) {
            continue;
          }
          return chunk;
        }
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ChunkTask.prototype, 'totalChunkCount', {
    /**
     * 总共分片数量(所有分块的分片数量总和)
     * @returns {number}
     */
    get: function() {
      let count = 0;
      for (let _i = 0, _a = this._blocks; _i < _a.length; _i++) {
        let block = _a[_i];
        count += block.chunks.length;
      }
      return count;
    },
    enumerable: true,
    configurable: true
  });
  return ChunkTask;
}(BaseTask));
/**
 * 分块，分块大小七牛固定是4M
 */
let Block = (function() {
  /**
   *
   * @param start 起始位置
   * @param end 结束位置
   * @param data 块数据
   * @param chunkSize 分片数据的最大大小
   * @param file 分块所属文件
   */
  function Block(start, end, data, chunkSize, file) {
    this._chunks = [];
    this._isFinish = false; // 是否上传完成
    this._processing = false; // 是否正在上传
    this._data = data;
    this._start = start;
    this._end = end;
    this._file = file;
    this.spliceBlock2Chunk(chunkSize);
  }

  /**
   * 将块分片
   */
  Block.prototype.spliceBlock2Chunk = function(chunkSize) {
    let blockSize = this._data.size;
    let data = this._data;
    // 总片数
    let chunkCount = Math.ceil(blockSize / chunkSize);
    for (let i = 0; i < chunkCount; i++) {
      let start = i * chunkSize; // 起始位置
      let end = start + chunkSize; // 结束位置
      // 构造一个片实例
      let chunk = new Chunk(start, end, data.slice(start, end), this);
      // 添加到数组中
      this._chunks.push(chunk);
    }
  };
  Object.defineProperty(Block.prototype, 'processing', {
    /**
     * 是否上传中
     * @returns {boolean}
     */
    get: function() {
      return this._processing;
    },
    set: function(value) {
      this._processing = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Block.prototype, 'file', {
    /**
     * 分块所属的文件
     * @returns {File}
     */
    get: function() {
      return this._file;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Block.prototype, 'isFinish', {
    /**
     * 是否已经结束
     * @returns {boolean}
     */
    get: function() {
      return this._isFinish;
    },
    set: function(value) {
      this._isFinish = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Block.prototype, 'data', {
    /**
     * 返回分块数据
     * @returns {Blob}
     */
    get: function() {
      return this._data;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Block.prototype, 'start', {
    /**
     * 返回字节起始位置
     * @returns {number}
     */
    get: function() {
      return this._start;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Block.prototype, 'end', {
    /**
     * 返回字节结束位置
     * @returns {number}
     */
    get: function() {
      return this._end;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Block.prototype, 'chunks', {
    get: function() {
      return this._chunks;
    },
    enumerable: true,
    configurable: true
  });
  return Block;
}());
/**
 * 分片，分片大小可以自定义，至少1字节
 */
let Chunk = (function() {
  /**
   *
   * @param start 字节起始位置
   * @param end 字节结束位置
   * @param data 分片数据
   * @param block 分块对象
   */
  function Chunk(start, end, data, block) {
    this._processing = false; // 是否正在上传
    this._isFinish = false; // 是否上传完成
    this._start = start;
    this._end = end;
    this._data = data;
    this._block = block;
  }

  Object.defineProperty(Chunk.prototype, 'block', {
    /**
     * 返回chunk所属的Block对象
     * @returns {Block}
     */
    get: function() {
      return this._block;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Chunk.prototype, 'start', {
    /**
     * 返回字节起始位置
     * @returns {number}
     */
    get: function() {
      return this._start;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Chunk.prototype, 'end', {
    /**
     * 返回字节结束位置
     * @returns {number}
     */
    get: function() {
      return this._end;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Chunk.prototype, 'data', {
    /**
     * 返回分片数据
     * @returns {Blob}
     */
    get: function() {
      return this._data;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Chunk.prototype, 'isFinish', {
    /**
     * 是否已经结束
     * @returns {boolean}
     */
    get: function() {
      return this._isFinish;
    },
    set: function(value) {
      this._isFinish = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Chunk.prototype, 'host', {
    get: function() {
      return this._host;
    },
    set: function(value) {
      this._host = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Chunk.prototype, 'processing', {
    /**
     * 是否上传中
     * @returns {boolean}
     */
    get: function() {
      return this._processing;
    },
    set: function(value) {
      this._processing = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Chunk.prototype, 'ctx', {
    /**
     * 返回上传控制信息(七牛服务器返回前一次上传返回的分片上传控制信息,用于下一次上传,第一个chunk此值为空)
     * @returns {string}
     */
    get: function() {
      return this._ctx;
    },
    set: function(value) {
      this._ctx = value;
    },
    enumerable: true,
    configurable: true
  });
  return Chunk;
}());

let UUID = (function() {
  function UUID() {}

  UUID.uuid = function() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    return uuid;
  };
  return UUID;
}());

let guid = function(time) {
  let result = '';
  time || (time = 2);
  for (let i = 0; i < time; i++) {
    result += (function() {
      let c = new Date();
      let b = c.getSeconds() + '';
      let d = c.getMinutes() + '';
      let e = c.getMilliseconds() + '';
      for (let i = b.length, j = 2; i < j; i++) {
        b = '0' + b;
      }
      for (let i = d.length, j = 2; i < j; i++) {
        d = '0' + d;
      }
      for (let i = e.length, j = 3; i < j; i++) {
        e = '0' + e;
      }
      return b + d + e + (((1 + Math.random()) * 0x10000) | 0).toString(
        16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(
        16);
    })();
  }
  return result.toUpperCase();
};

let SimpleUploadInterceptor = (function() {
  function SimpleUploadInterceptor() {}

  SimpleUploadInterceptor.prototype.onIntercept = function(task) {
    return false;
  };
  SimpleUploadInterceptor.prototype.onInterrupt = function(task) {
    return false;
  };
  return SimpleUploadInterceptor;
}());

/**
 * UploaderBuilder
 *
 */
export const UploaderBuilder = (function() {
  function UploaderBuilder() {
    this.FILE_INPUT_EL_ID = 'qiniu4js-input';
    this._retry = 0; // 最大重试次数
    this._domain = UploaderBuilder.UPLOAD_DOMAIN; // 上传域名
    this._scheme = null; // 上传域名的 scheme
    this._size = 1024 * 1024; // 分片大小,单位字节,上限4m,不能为0
    this._chunk = true; // 分块上传
    this._auto = true; // 自动上传,每次选择文件后
    this._multiple = true; // 是否支持多文件
    this._accept = []; // 接受的文件类型
    this._compress = 1; // 图片压缩质量
    this._scale = [0, 0]; // 缩放大小,限定高度等比[h:200,w:0],限定宽度等比[h:0,w:100],限定长宽[h:200,w:100]
    this._saveKey = false;
    this._tokenShare = true; // 分享token,如果为false,每一次HTTP请求都需要新获取Token
    this._interceptors = []; // 任务拦截器
    this._isDebug = false; //
    this._id = this.FILE_INPUT_EL_ID + '_' + guid(3);
  }

  /**
   * 设置上传的域名,默认是 {http: 'http://upload.qiniu.com', https: 'https://up.qbox.me'}
   * @param domain
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.domain = function(domain) {
    this._domain = domain;
    return this;
  };
  /**
   * 设置上传域名的协议类型，默认从 window.location.protocol 读取
   * @param scheme
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.scheme = function(scheme) {
    this._scheme = scheme;
    return this;
  };
  /**
   * 添加一个拦截器
   * @param interceptor
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.interceptor = function(interceptor) {
    this._interceptors.push(Object.assign(new SimpleUploadInterceptor(),
      interceptor));
    return this;
  };
  /**
   * 上传失败后的重传尝试次数
   * @param retry 默认0次，不尝试次重传
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.retry = function(retry) {
    this._retry = retry;
    return this;
  };
  /**
   * 设置分片大小
   * @param size 分块大小,单位字节,默认4*1024*1024字节(4mb)
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.size = function(size) {
    this._size = Math.min(Math.max(size, 1), UploaderBuilder.MAX_CHUNK_SIZE);
    return this;
  };
  /**
   * 选择文件后,是否自动上传
   * @param auto 默认true
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.auto = function(auto) {
    this._auto = auto;
    return this;
  };
  UploaderBuilder.prototype.id = function(id) {
    this._id = id;
    return this;
  };
  /**
   * 是否支持多文件选择
   * @param multiple 默认true
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.multiple = function(multiple) {
    this._multiple = multiple;
    return this;
  };
  /**
   * 接受上传的文件类型
   * @param accept 数组形式例如:['.png','video/*']
   *
   * 详细配置见http://www.w3schools.com/tags/att_input_accept.asp
   *
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.accept = function(accept) {
    this._accept = accept;
    return this;
  };
  /**
   * 设置上传按钮
   * @param button 上传按钮ID
   * @param eventName 上传按钮的监听事件名称，默认为 "click" 。
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.button = function(button, eventName) {
    if (eventName === void 0) {
      eventName = 'click';
    }
    this._button = button;
    this._buttonEventName = eventName;
    return this;
  };
  /**
   * 图片质量压缩,只在上传的文件是图片的时候有效
   * @param compress 0-1,默认1,不压缩
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.compress = function(compress) {
    this._compress = Math.max(Math.min(compress, 1), 0);
    return this;
  };
  /**
   * 图片缩放
   * @returns {UploaderBuilder}
   * @param scale
   */
  UploaderBuilder.prototype.scale = function(scale) {
    this._scale = scale;
    return this;
  };
  /**
   * 设置 saveKey
   * @param saveKey
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.saveKey = function(saveKey) {
    this._saveKey = saveKey;
    return this;
  };
  /**
   * 获取Token的地址
   * @param tokenUrl
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.tokenUrl = function(tokenUrl) {
    this._tokenFunc = function(uploader, task) {
      return uploader.requestTaskToken(task, tokenUrl);
    };
    return this;
  };
  /**
   * 获取Token的函数
   * @param tokenFunc
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.tokenFunc = function(tokenFunc) {
    this._tokenFunc = function(uploader, task) {
      // eslint-disable-next-line no-undef
      return new Promise(function(resolve) {
        tokenFunc(resolve, task);
      });
    };
    return this;
  };
  /**
   * 上传生命周期钩子
   * @param listener
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.listener = function(listener) {
    this._listener = listener;
    return this;
  };
  /**
   * 是否分享token,如果为false每上传一个文件都需要请求一次Token。
   * @param tokenShare
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.tokenShare = function(tokenShare) {
    this._tokenShare = tokenShare;
    return this;
  };
  /**
   * 是否分块上传
   * @param chunk 默认false
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.chunk = function(chunk) {
    this._chunk = chunk;
    return this;
  };
  /**
   * 是否开启debug模式
   * @param debug 默认false
   * @returns {UploaderBuilder}
   */
  UploaderBuilder.prototype.debug = function(debug) {
    this._isDebug = debug;
    return this;
  };
  Object.defineProperty(UploaderBuilder.prototype, 'getRetry', {
    get: function() {
      return this._retry;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getSize', {
    get: function() {
      return this._size;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getAuto', {
    get: function() {
      return this._auto;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getId', {
    get: function() {
      return this._id;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getMultiple', {
    get: function() {
      return this._multiple;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getAccept', {
    get: function() {
      return this._accept;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getButton', {
    get: function() {
      return this._button;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getButtonEventName', {
    get: function() {
      return this._buttonEventName;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getCompress', {
    get: function() {
      return this._compress;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getScale', {
    get: function() {
      return this._scale;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getListener', {
    get: function() {
      return this._listener;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getSaveKey', {
    get: function() {
      return this._saveKey;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getTokenFunc', {
    get: function() {
      return this._tokenFunc;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getTokenShare', {
    get: function() {
      return this._tokenShare;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getChunk', {
    get: function() {
      return this._chunk;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getIsDebug', {
    get: function() {
      return this._isDebug;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getInterceptors', {
    get: function() {
      return this._interceptors;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(UploaderBuilder.prototype, 'getDomain', {
    get: function() {
      let domain = this._domain;
      if (domain == null) {
        domain = UploaderBuilder.UPLOAD_DOMAIN;
      }
      if (typeof domain !== 'string') {
        let scheme = this._scheme;
        if (typeof scheme !== 'string') {
          let protocol = window.location.protocol;
          scheme = protocol.substring(0, protocol.length - 1);
        }
        domain = domain[scheme];
      }
      return domain.endsWith('/') ? domain.substring(0, domain.length -
        1) : domain;
    },
    enumerable: true,
    configurable: true
  });
  UploaderBuilder.prototype.build = function() {
    return new Uploader(this);
  };
  return UploaderBuilder;
}());
UploaderBuilder.MAX_CHUNK_SIZE = 1024 * 1024; // 分片最大值
UploaderBuilder.BLOCK_SIZE = UploaderBuilder.MAX_CHUNK_SIZE; // 分块大小，只有大于这个数才需要分块
UploaderBuilder.UPLOAD_URL = 'http://upload.qiniu.com';
UploaderBuilder.UPLOAD_DOMAIN = {
  http: 'http://upload.qiniu.com',
  https: 'https://up.qbox.me'
};

let Debug = (function() {
  function Debug() {}

  Object.defineProperty(Debug, 'enable', {
    get: function() {
      return this._enable;
    },
    set: function(value) {
      this._enable = value;
    },
    enumerable: true,
    configurable: true
  });
  Debug.d = function(object) {
    if (!Debug._enable) {
      return;
    }
    console.debug(object);
  };

  Debug.l = function(object) {
    if (!Debug._enable) {
      return;
    }
    console.log(object);
  };
  Debug.e = function(object) {
    if (!Debug._enable) {
      return;
    }
    console.error(object);
  };
  Debug.w = function(object) {
    if (!Debug._enable) {
      return;
    }
    console.warn(object);
  };
  Debug.i = function(object) {
    if (!Debug._enable) {
      return;
    }
    console.info(object);
  };
  return Debug;
}());
Debug._enable = true;

let SimpleUploadListener = (function() {
  function SimpleUploadListener() {}

  SimpleUploadListener.prototype.onReady = function(taskQueue) {};
  SimpleUploadListener.prototype.onStart = function(taskQueue) {};
  SimpleUploadListener.prototype.onTaskProgress = function(task) {};
  SimpleUploadListener.prototype.onTaskGetKey = function(task) {
    return null;
  };
  SimpleUploadListener.prototype.onTaskFail = function(task) {};
  SimpleUploadListener.prototype.onTaskSuccess = function(task) {};
  SimpleUploadListener.prototype.onTaskRetry = function(task) {};
  SimpleUploadListener.prototype.onFinish = function(taskQueue) {};
  return SimpleUploadListener;
}());

/**
 * 直接上传
 */
let DirectUploadPattern = (function() {
  function DirectUploadPattern() {}

  DirectUploadPattern.prototype.init = function(uploader) {
    this.uploader = uploader;
  };
  /**
   * 实现接口的上传方法
   * @param task
   */
  DirectUploadPattern.prototype.upload = function(task) {
    let _this = this;
    this.uploader.getToken(task).then(function(token) {
      task.startDate = new Date();
      _this.uploadFile(token, task);
    });
  };
  /**
   * 创建表单
   * @param token
   * @returns {FormData}
   */
  DirectUploadPattern.prototype.createFormData = function(token, task) {
    let formData = new FormData();
    // key存在，添加到formData中，若不设置，七牛服务器会自动生成hash key
    if (task.key !== null && task.key !== undefined) {
      formData.append('key', task.key);
    }
    formData.append('token', token);
    formData.append('file', task.file);
    Debug.d('\u521B\u5EFAformData\u5BF9\u8C61');
    return formData;
  };
  /**
   * 上传文件
   * @param token
   * @param task
   */
  DirectUploadPattern.prototype.uploadFile = function(token, task) {
    let _this = this;
    let xhr = new XMLHttpRequest();
    // 上传中
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        let progress = Math.round((e.loaded * 100) / e.total);
        if (task.progress < progress) {
          task.progress = progress;
          _this.uploader.listener.onTaskProgress(task);
        }
      }
    };
    // 上传完成
    xhr.upload.onload = function() {
      if (task.progress < 100) {
        task.progress = 100;
        _this.uploader.listener.onTaskProgress(task);
      }
    };
    let url = this.uploader.domain;
    // 避免浏览器缓存http请求
    url += ((/\?/).test(this.uploader.domain) ? '&' : '?') + (new Date())
      .getTime();
    xhr.open('POST', url, true);
    // xhr.setRequestHeader('Content-Type',
    //   'application/octet-stream') // 设置contentType
    // xhr.setRequestHeader('Authorization', 'UpToken ' + token) // 添加token验证头
    xhr.setRequestHeader('Mime', task.file.type); // 添加Mime信息

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 && xhr.responseText !== '') {
          task.result = JSON.parse(xhr.responseText);
          task.isSuccess = true;
          task.isFinish = true;
          task.endDate = new Date();
          _this.uploader.listener.onTaskSuccess(task);
        } else if (_this.retryTask(task)) {
          Debug.w(task.file.name +
            '\u4E0A\u4F20\u5931\u8D25,\u51C6\u5907\u5F00\u59CB\u91CD\u4F20'
          );
          _this.uploader.listener.onTaskRetry(task);
        } else {
          Debug.w(task.file.name + '\u4E0A\u4F20\u5931\u8D25');
          task.error = xhr.response;
          task.isSuccess = false;
          task.isFinish = true;
          task.endDate = new Date();
          _this.uploader.listener.onTaskFail(task);
        }
        // 所有任务都结束了
        if (_this.uploader.isTaskQueueFinish()) {
          // 更改任务执行中标志
          _this.uploader.tasking = false;
          // onFinish callback
          _this.uploader.listener.onFinish(_this.uploader.taskQueue);
        }
      }
    };
    let formData = this.createFormData(token, task);
    xhr.send(formData);
  };
  /**
   * 重传
   * @param task
   * @returns {boolean}
   */
  DirectUploadPattern.prototype.retryTask = function(task) {
    // 达到重试次数
    if (task.retry >= this.uploader.retry) {
      Debug.w(task.file.name +
        '\u8FBE\u5230\u91CD\u4F20\u6B21\u6570\u4E0A\u9650' + this.uploader
          .retry + ',\u505C\u6B62\u91CD\u4F20');
      return false;
    }
    task.retry++;
    Debug.w(task.file.name +
      '\u5F00\u59CB\u91CD\u4F20,\u5F53\u524D\u91CD\u4F20\u6B21\u6570' +
      task.retry);
    this.upload(task);
    return true;
  };
  return DirectUploadPattern;
}());

/**
 * 分块上传
 */
let ChunkUploadPattern = (function() {
  function ChunkUploadPattern() {}

  ChunkUploadPattern.prototype.init = function(uploader) {
    this.uploader = uploader;
  };
  ChunkUploadPattern.prototype.upload = function(task) {
    let _this = this;
    this.uploader.getToken(task).then(function(token) {
      task.startDate = new Date();
      _this.uploadBlock(token, task);
    });
  };
  ChunkUploadPattern.prototype.uploadBlock = function(token, task) {
    let _this = this;
    // eslint-disable-next-line no-undef
    let chain = Promise.resolve();
    for (let _i = 0, _a = task.blocks; _i < _a.length; _i++) {
      let block = _a[_i];
      let loop1 = function(chunk) {
        chain = chain.then(function() {
          return _this.uploadChunk(chunk, _this.uploader._token,
            task);
        });
      };
      for (let _b = 0, _c = block.chunks; _b < _c.length; _b++) {
        let chunk = _c[_b];
        loop1(chunk);
      }
    }
    chain.then(function() {
      return _this.concatChunks(token, task);
    }).then(function() {
      // 所有任务都结束了
      if (_this.uploader.isTaskQueueFinish()) {
        // 更改任务执行中标志
        _this.uploader.tasking = false;
        // 监听器调用
        _this.uploader.listener.onFinish(_this.uploader.taskQueue);
      }
    })['catch'](function(response) {
      Debug.w(task.file.name + '\u5206\u5757\u4E0A\u4F20\u5931\u8D25');
      task.error = response;
      task.isSuccess = false;
      task.isFinish = true;
      task.endDate = new Date();
      _this.uploader.listener.onTaskFail(task);
    });
  };
  ChunkUploadPattern.prototype.uploadChunk = function(chunk, token, task) {
    let _this = this;
    // eslint-disable-next-line no-undef
    return new Promise(function(resolve, reject) {
      let isFirstChunkInBlock = chunk.block.chunks.indexOf(chunk) ===
        0;
      let chunkIndex = chunk.block.chunks.indexOf(chunk);
      // 前一个chunk,如果存在的话
      let prevChunk = isFirstChunkInBlock ? null : chunk.block.chunks[
        chunkIndex - 1];
      let url = isFirstChunkInBlock ? _this.getUploadBlockUrl(chunk.block
        .data.size) : _this.getUploadChunkUrl(chunk.start,
        prevChunk ? prevChunk.ctx : null,
        prevChunk ? prevChunk.host : null);
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url += ((/\?/).test(url) ? '&' : '?') + (new Date())
        .getTime(), true);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream'); // 设置contentType
      xhr.setRequestHeader('Mime', task.file.type); // 添加Mime信息
      xhr.setRequestHeader('Authorization', 'UpToken ' + token); // 添加token验证头
      // 分片上传中
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          let progress = Math.round(((task.finishedBlocksSize +
            chunk.start + e.loaded) / task.file.size) * 100);
          if (task.progress < progress) {
            task.progress = progress;
            _this.uploader.listener.onTaskProgress(task);
          }
        }
      };
      // 分片上传完成
      xhr.upload.onload = function() {
        let progress = Math.round(((task.finishedBlocksSize + chunk
          .start + chunk.data.size) / task.file.size) * 100);
        if (task.progress < progress) {
          task.progress = progress;
          _this.uploader.listener.onTaskProgress(task);
        }
      };
      // 响应返回
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 && xhr.responseText !== '') {
            let result = JSON.parse(xhr.responseText);
            chunk.isFinish = true;
            chunk.processing = false;
            chunk.ctx = result.ctx;
            chunk.host = result.host;
            let chunkIndex1 = chunk.block.chunks.indexOf(chunk);
            let hasNextChunkInThisBlock = chunkIndex1 !== chunk.block
              .chunks.length - 1;
            if (!hasNextChunkInThisBlock) {
              chunk.block.isFinish = true;
              chunk.block.processing = false;
            }
            resolve();
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.send(chunk.data);
    });
  };
  ChunkUploadPattern.prototype.concatChunks = function(token, task) {
    let _this = this;
    // eslint-disable-next-line no-undef
    return new Promise(function(resolve, reject) {
      let encodedKey = task.key ? btoa(encodeURIComponent(task.key))
        : null;
      let url = _this.getMakeFileUrl(task.file.size, encodedKey);
      // 构建所有数据块最后一个数据片上传后得到的<ctx>的组合成的列表字符串
      let ctxListString = '';
      for (let _i = 0, _a = task.blocks; _i < _a.length; _i++) {
        let block = _a[_i];
        let lastChunk = block.chunks[block.chunks.length - 1];
        ctxListString += lastChunk.ctx + ',';
      }
      if (ctxListString.endsWith(',')) {
        ctxListString = ctxListString.substring(0, ctxListString.length -
          1);
      }
      let xhr = new XMLHttpRequest();
      xhr.open('POST', url += ((/\?/).test(url) ? '&' : '?') + (new Date())
        .getTime(), true);
      xhr.setRequestHeader('Content-Type', 'text/plain'); // 设置contentType
      xhr.setRequestHeader('Authorization', 'UpToken ' + token);
      xhr.setRequestHeader('Mime', task.file.type); // 添加Mime信息

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          task.isFinish = true;
          if (xhr.status === 200 && xhr.responseText !== '') {
            let result = JSON.parse(xhr.responseText);
            task.isSuccess = true;
            task.result = result;
            task.endDate = new Date();
            _this.uploader.listener.onTaskSuccess(task);
            resolve();
          } else if (_this.retryTask(task)) {
            Debug.w(task.file.name +
              '\u5206\u5757\u4E0A\u4F20\u5931\u8D25,\u51C6\u5907\u5F00\u59CB\u91CD\u4F20'
            );
            _this.uploader.listener.onTaskRetry(task);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.send(ctxListString);
    });
  };
  /**
   * 获取块上传的url
   * @param blockSize
   * @returns {string}
   */
  ChunkUploadPattern.prototype.getUploadBlockUrl = function(blockSize) {
    return this.uploader.domain + '/mkblk/' + blockSize;
  };
  /**
   * 获取片上传的url
   * @param start 片的在块中的起始位置
   * @param ctx 前一次上传返回的块级上传控制信息。
   * @param host 指定host
   */
  ChunkUploadPattern.prototype.getUploadChunkUrl = function(start, ctx,
    host) {
    return (host || this.uploader.domain) + '/bput/' + ctx + '/' +
      start + '/';
  };
  /**
   * 获取合并块为文件的url
   * @param fileSize 文件大小
   * @param encodedKey base64UrlEncode后的资源名称,若未指定，则使用saveKey；若未指定saveKey，则使用资源内容的SHA1值作为资源名。
   * @returns {string}
   */
  ChunkUploadPattern.prototype.getMakeFileUrl = function(fileSize,
    encodedKey) {
    if (encodedKey) {
      return this.uploader.domain + '/mkfile/' + fileSize + '/key/' +
        encodedKey;
    } else {
      return this.uploader.domain + '/mkfile/' + fileSize;
    }
  };
  ChunkUploadPattern.prototype.retryTask = function(task) {
    // 达到重试次数
    if (task.retry >= this.uploader.retry) {
      Debug.w(task.file.name +
        '\u8FBE\u5230\u91CD\u4F20\u6B21\u6570\u4E0A\u9650' + this.uploader
          .retry + ',\u505C\u6B62\u91CD\u4F20');
      return false;
    }
    task.retry++;
    Debug.w(task.file.name +
      '\u5F00\u59CB\u91CD\u4F20,\u5F53\u524D\u91CD\u4F20\u6B21\u6570' +
      task.retry);
    // this.upload(task);
    return true;
  };
  return ChunkUploadPattern;
}());

/**
 * Object.assign polyfill
 */
if (typeof Object.assign !== 'function') {
  Object.assign = function(target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (let index = 1; index < arguments.length; index++) {
      let source = arguments[index];
      if (source != null) {
        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
/**
 * canvas.toBlob polyfill
 */
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function(callback, type, quality) {
      let binStr = atob(this.toDataURL(type, quality).split(',')[1]);
      let len = binStr.length;
      // eslint-disable-next-line no-undef
      let arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      callback(new Blob([arr], {
        type: type || 'image/png'
      }));
    }
  });
}
/**
 * endsWith polyfill
 */
if (!String.prototype.endsWith) {
  let toString1 = {}.toString;
  let endsWith = function(search) {
    if (this == null) {
      throw TypeError();
    }
    let string = String(this);
    if (search && toString1.call(search) === '[object RegExp]') {
      throw TypeError();
    }
    let stringLength = string.length;
    let searchString = String(search);
    let searchLength = searchString.length;
    let pos = stringLength;
    if (arguments.length > 1) {
      let position = arguments[1];
      if (position) {
        // `ToInteger`
        pos = position ? Number(position) : 0;
      }
    }
    let end = Math.min(Math.max(pos, 0), stringLength);
    let start = end - searchLength;
    if (start < 0) {
      return false;
    }
    let index = -1;
    while (++index < searchLength) {
      if (string.charCodeAt(start + index) !== searchString.charCodeAt(index)) {
        return false;
      }
    }
    return true;
  };
  if (Object.defineProperty) {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(String.prototype, 'endsWith', {
      'value': endsWith,
      'configurable': true,
      'writable': true
    });
  } else {
    // eslint-disable-next-line no-extend-native
    String.prototype.endsWith = endsWith;
  }
}

export const Uploader = (function() {
  function Uploader(builder) {
    let _this = this;
    this.FILE_INPUT_EL_ID = 'qiniu4js-input';
    this._taskQueue = []; // 任务队列
    this._tasking = false; // 任务执行中
    this._scale = []; // 缩放大小,限定高度等比缩放[h:200,w:0],限定宽度等比缩放[h:0,w:100],限定长宽[h:200,w:100]
    this._saveKey = false;
    /**
     * 处理文件
     */
    this.handleFiles = function() {
      // 如果没有选中文件就返回
      if (_this.fileInput.files.length === 0) {
        return;
      }
      // 生成task
      _this.generateTask();
      // 是否中断任务
      let isInterrupt = false;
      let interceptedTasks = [];
      // 任务拦截器过滤
      for (let _i = 0, _a = _this.taskQueue; _i < _a.length; _i++) {
        let task = _a[_i];
        for (let _b = 0, _c = _this.interceptors; _b < _c.length; _b++) {
          let interceptor = _c[_b];
          // 拦截生效
          if (interceptor.onIntercept(task)) {
            interceptedTasks.push(task);
            Debug.d('任务拦截器拦截了任务:');
            Debug.d(task);
          }
          // 打断生效
          if (interceptor.onInterrupt(task)) {
            // 将打断标志位设为true
            isInterrupt = true;
            break;
          }
        }
      }
      if (isInterrupt) {
        Debug.w('任务拦截器中断了任务队列');
        return;
      }
      // 从任务队列中去除任务
      for (let _d = 0, interceptedTasks1 = interceptedTasks; _d <
        interceptedTasks1.length; _d++) {
        let task = interceptedTasks1[_d];
        let index = _this.taskQueue.indexOf(task);
        if (index !== -1) {
          _this.taskQueue.splice(index, 1);
        }
      }
      // 回调函数函数
      _this.listener.onReady(_this.taskQueue);
      // 处理图片
      _this.handleImages().then(function() {
        // 自动上传
        if (_this.auto) {
          Debug.d('开始自动上传');
          _this.start();
        }
      });
    };
    this.resolveUUID = function(s) {
      let re = /\$\(uuid\)/;
      if (re.test(s)) {
        return s.replace(re, UUID.uuid());
      }
      return s;
    };
    this.resolveImageInfo = function(blob, s) {
      let widthRe = /\$\(imageInfo\.width\)/;
      let heightRe = /\$\(imageInfo\.height\)/;
      if (!widthRe.test(s) && !heightRe.test(s)) {
        // eslint-disable-next-line no-undef
        return Promise.resolve(s);
      }
      // eslint-disable-next-line no-undef
      return new Promise(function(resolve) {
        let img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onload = function() {
          s = s.replace(widthRe, img.width.toString());
          s = s.replace(heightRe, img.height.toString());
          resolve(s);
        };
      });
    };
    this.onSaveKeyResolved = function(saveKey) {
      _this._tokenShare = _this._tokenShare && _this._saveKey === saveKey;
      return saveKey;
    };
    this._retry = builder.getRetry;
    this._size = builder.getSize;
    this._chunk = builder.getChunk;
    this._auto = builder.getAuto;
    this._multiple = builder.getMultiple;
    this._accept = builder.getAccept;
    this._button = builder.getButton;
    this._buttonEventName = builder.getButtonEventName;
    this._compress = builder.getCompress;
    this._scale = builder.getScale;
    this._saveKey = builder.getSaveKey;
    this._tokenFunc = builder.getTokenFunc;
    this._tokenShare = builder.getTokenShare;
    this._listener = Object.assign(new SimpleUploadListener(), builder.getListener);
    this._interceptors = builder.getInterceptors;
    this._domain = builder.getDomain;
    this._fileInputId = builder.getId;
    Debug.enable = builder.getIsDebug;
    this.validateOptions();
    this.init();
  }

  /**
   * 初始化操作
   */
  Uploader.prototype.init = function() {
    this.initFileInputEl();
    this.initUploadPattern();
  };
  /**
   * 初始化上传模式
   */
  Uploader.prototype.initUploadPattern = function() {
    this._directUploadPattern = new DirectUploadPattern();
    this._directUploadPattern.init(this);
    this._chunkUploadPattern = new ChunkUploadPattern();
    this._chunkUploadPattern.init(this);
  };
  /**
   * 初始化file input element
   */
  Uploader.prototype.initFileInputEl = function() {
    // 查询已经存在的file input
    let exist = document.getElementById(this._fileInputId);
    // 创建input元素
    this._fileInput = exist || document.createElement('input');
    if (!exist) {
      this.fileInput.type = 'file'; // type file
      this.fileInput.id = this._fileInputId; // id 方便后面查找
      this.fileInput.style.display = 'none'; // 隐藏file input
      // 多文件
      if (this.multiple) {
        // 多文件
        this.fileInput.multiple = true;
      }
      // 文件类型
      if (this.accept && this.accept.length !== 0) {
        // this.fileInput.accept = "image/*" ;
        // Debug.d("accept\u7C7B\u578B " + acceptValue);
      }
      // 将input元素添加到body子节点的末尾
      document.body.appendChild(this.fileInput);
      // 选择文件监听器
    }
    this.fileInput.addEventListener('change', this.handleFiles, false);
    if (this._button) {
      let button = document.getElementById(this._button);
      button.addEventListener(this._buttonEventName, this.chooseFile.bind(
        this));
    }
  };
  /**
   * 上传完成或者失败后,对本次上传任务进行清扫
   */
  Uploader.prototype.resetUploader = function() {
    this.taskQueue.length = 0;
    this._token = null;
    Debug.d('uploader已重置');
  };
  /**
   * 是否是分块任务
   * @param task
   * @returns {boolean}
   */
  Uploader.isChunkTask = function(task) {
    return task.constructor.name === ChunkTask.name && task instanceof ChunkTask;
  };
  /**
   * 是否是直传任务
   * @param task
   * @returns {boolean}
   */
  Uploader.isDirectTask = function(task) {
    return task.constructor.name === DirectTask.name && task instanceof DirectTask;
  };
  /**
   * 生成task
   */
  Uploader.prototype.generateTask = function() {
    this.resetUploader();
    let files = this.fileInput.files;
    // 遍历files 创建上传任务
    for (let i = 0; i < this.fileInput.files.length; i++) {
      let file = files[i];
      let task = void 0;
      // 只有在开启分块上传，并且文件大小大于4mb的时候才进行分块上传
      if (this.chunk && file.size > UploaderBuilder.BLOCK_SIZE) {
        task = new ChunkTask(file, UploaderBuilder.BLOCK_SIZE, this.size);
      } else {
        task = new DirectTask(file);
      }
      if (this._saveKey === false) {
        task.key = this.listener.onTaskGetKey(task);
      }
      this.taskQueue.push(task);
    }
  };
  /**
   * 处理图片-缩放-质量压缩
   */
  Uploader.prototype.handleImages = function() {
    let promises = [];
    if (this.compress !== 1 || this.scale[0] !== 0 || this.scale[1] !== 0) {
      let loop1 = function(task) {
        if (!task.file.type.match('image.*')) {
          return 'continue';
        }
        if (task.file.type === 'image/gif') {
          return 'continue';
        }
        Debug.d(task.file.name +
          ' \u5904\u7406\u524D\u7684\u56FE\u7247\u5927\u5C0F:' + task
            .file.size / 1024 + 'kb');
        let canvas = document.createElement('canvas');
        let img = new Image();
        let ctx = canvas.getContext('2d');
        img.src = URL.createObjectURL(task.file);
        let _this = this1;
        // eslint-disable-next-line no-undef
        promises.push(new Promise(function(resolve) {
          img.onload = function() {
            let imgW = img.width;
            let imgH = img.height;
            let scaleW = _this.scale[0];
            let scaleH = _this.scale[1];
            if (scaleW === 0 && scaleH > 0) {
              canvas.width = imgW / imgH * scaleH;
              canvas.height = scaleH;
            } else if (scaleH === 0 && scaleW > 0) {
              canvas.width = scaleW;
              canvas.height = imgH / imgW * scaleW;
            } else if (scaleW > 0 && scaleH > 0) {
              canvas.width = scaleW;
              canvas.height = scaleH;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }
            // 这里的长宽是绘制到画布上的图片的长宽
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // 0.95是最接近原图大小，如果质量为1的话会导致比原图大几倍。
            canvas.toBlob(function(blob) {
              resolve(blob);
              Debug.d(task.file.name +
                ' \u5904\u7406\u540E\u7684\u56FE\u7247\u5927\u5C0F:' +
                blob.size / 1024 + 'kb');
            }, 'image/jpeg', _this.compress * 0.95);
          };
          return img.onload;
        }).then(function(blob) {
          blob.name = task.file.name;
          task.file = blob;
          if (Uploader.isChunkTask(task)) {
            task.spliceFile2Block();
          }
        }));
      };
      let this1 = this;
      for (let _i = 0, _a = this.taskQueue; _i < _a.length; _i++) {
        let task = _a[_i];
        loop1(task);
      }
    }
    // eslint-disable-next-line no-undef
    return Promise.all(promises);
  };
  /**
   * 检验选项合法性
   */
  Uploader.prototype.validateOptions = function() {
    if (!this._tokenFunc) {
      throw new Error('你必须提供一个获取Token的回调函数');
    }
    if (!this.scale || !(this.scale instanceof Array) || this.scale.length !==
      2 || this.scale[0] < 0 || this.scale[1] < 0) {
      throw new Error(
        'scale必须是长度为2的number类型的数组,scale[0]为宽度，scale[1]为长度,必须大于等于0');
    }
  };
  /**
   * 开始上传
   */
  Uploader.prototype.start = function() {
    if (this.fileInput.files.length === 0) {
      throw new Error('没有选中的文件，无法start');
    }
    if (this.tasking) {
      throw new Error('任务执行中，请不要重复start');
    }
    this.listener.onStart(this.taskQueue);
    // 遍历任务队列
    for (let _i = 0, _a = this.taskQueue; _i < _a.length; _i++) {
      let task = _a[_i];
      Debug.d('\u6587\u4EF6-\u300E' + task.file.name + '\u300F-' + task.file
        .size + 'byte-' + task.file.size / 1024 + 'kb-' + task.file.size /
        1024 / 1024 + 'mb');
      // 根据任务的类型调用不同的上传模式进行上传
      if (Uploader.isDirectTask(task)) {
        // 直传
        this._directUploadPattern.upload(task);
      } else if (Uploader.isChunkTask(task)) {
        // 分块上传
        this._chunkUploadPattern.upload(task);
      } else {
        throw new Error('非法的task类型');
      }
    }
  };
  /**
   * 所有任务是否完成
   * @returns {boolean}
   */
  Uploader.prototype.isTaskQueueFinish = function() {
    for (let _i = 0, _a = this.taskQueue; _i < _a.length; _i++) {
      let task = _a[_i];
      if (!task.isFinish) {
        return false;
      }
    }
    return true;
  };
  /**
   * 选择文件
   */
  Uploader.prototype.chooseFile = function() {
    this.fileInput.click();
  };
  Uploader.prototype.getToken = function(task) {
    let _this = this;
    if (this._tokenShare && this._token) {
      // eslint-disable-next-line no-undef
      return Promise.resolve(this._token);
    }
    Debug.d('\u5F00\u59CB\u83B7\u53D6\u4E0A\u4F20token');
    // eslint-disable-next-line no-undef
    return Promise.resolve(this._tokenFunc(this, task)).then(function(
      token) {
      Debug.d('\u4E0A\u4F20token\u83B7\u53D6\u6210\u529F ' + token);
      _this._token = token;
      return token;
    });
  };
  Uploader.prototype.requestTaskToken = function(task, url) {
    let _this = this;
    return this.resolveSaveKey(task).then(function(saveKey) {
      return _this.requestToken(url, saveKey);
    });
  };
  Uploader.prototype.requestToken = function(url, saveKey) {
    // eslint-disable-next-line no-undef
    return new Promise(function(resolve, reject) {
      if (typeof saveKey === 'string') {
        url += ((/\?/).test(url) ? '&' : '?') + 'saveKey=' +
          encodeURIComponent(saveKey);
      }
      url += ((/\?/).test(url) ? '&' : '?') + (new Date()).getTime();
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status === 200) {
          resolve(xhr.response.uptoken);
          return;
        }
        reject(xhr.response);
      };
      xhr.onabort = function() {
        reject(new Error('aborted'));
      };
      xhr.responseType = 'json';
      xhr.send();
    });
  };
  Uploader.prototype.resolveSaveKey = function(task) {
    let _this = this;
    let saveKey = this._saveKey;
    if (typeof saveKey !== 'string') {
      // eslint-disable-next-line no-undef
      return Promise.resolve(undefined);
    }
    // eslint-disable-next-line no-undef
    return Promise.resolve(saveKey)
      .then(this.resolveUUID)
      .then(function(saveKey) {
        return _this.resolveImageInfo(task.file, saveKey);
      })
      .then(this.onSaveKeyResolved);
  };
  Object.defineProperty(Uploader.prototype, 'retry', {
    get: function() {
      return this._retry;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'size', {
    get: function() {
      return this._size;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'auto', {
    get: function() {
      return this._auto;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'id', {
    get: function() {
      return this._id;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'multiple', {
    get: function() {
      return this._multiple;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'accept', {
    get: function() {
      return this._accept;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'compress', {
    get: function() {
      return this._compress;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'scale', {
    get: function() {
      return this._scale;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'listener', {
    get: function() {
      return this._listener;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'fileInput', {
    get: function() {
      return this._fileInput;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'chunk', {
    get: function() {
      return this._chunk;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'taskQueue', {
    get: function() {
      return this._taskQueue;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'tasking', {
    get: function() {
      return this._tasking;
    },
    set: function(value) {
      this._tasking = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'interceptors', {
    //
    // get fileInputId(): string {
    //     return this._fileInputId;
    // }
    get: function() {
      return this._interceptors;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Uploader.prototype, 'domain', {
    get: function() {
      return this._domain;
    },
    enumerable: true,
    configurable: true
  });
  return Uploader;
}());
