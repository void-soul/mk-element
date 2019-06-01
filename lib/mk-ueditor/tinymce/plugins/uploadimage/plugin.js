(function() {
  var BaseTask = (function() {
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
  })();
  var defs = {};
  var instantiate = function(id) {
    var actual = defs[id];
    var dependencies = actual.deps;
    var definition = actual.defn;
    var len = dependencies.length;
    var instances = new Array(len);
    for (var i = 0; i < len; ++i) {
      instances[i] = dem(dependencies[i]);
    }
    var defResult = definition.apply(null, instances);
    if (defResult === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw 'module [' + id + '] returned undefined';
    }
    actual.instance = defResult;
  };
  var def = function(id, dependencies, definition) {
    if (typeof id !== 'string') {
      // eslint-disable-next-line no-throw-literal
      throw 'module id must be a string';
    } else if (dependencies === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw 'no dependencies for ' + id;
    } else if (definition === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw 'no definition function for ' + id;
    }
    defs[id] = {
      deps: dependencies,
      defn: definition,
      instance: undefined
    };
  };

  var dem = function(id) {
    var actual = defs[id];
    if (actual === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw 'module [' + id + '] was undefined';
    } else if (actual.instance === undefined) {
      instantiate(id);
    }
    return actual.instance;
  };
  var req = function(ids, callback) {
    var len = ids.length;
    var instances = new Array(len);
    for (var i = 0; i < len; ++i) {
      instances[i] = dem(ids[i]);
    }
    callback.apply(null, instances);
  };
  var ephox = {};
  ephox.bolt = {
    module: {
      api: {
        define: def,
        require: req,
        demand: dem
      }
    }
  };
  var define = def;
  var defineGlobal = function(id, ref) {
    define(id, [], function() {
      return ref;
    });
  };
  // eslint-disable-next-line no-undef
  defineGlobal('global!tinymce.util.Tools.resolve', tinymce.util.Tools.resolve);
  define('tinymce.core.PluginManager', [
    'global!tinymce.util.Tools.resolve'
  ], function(resolve) {
    return resolve('tinymce.PluginManager');
  });
  define('tinymce.plugins.uploadimage.api.Commands', [], function() {
    return {
      register: function(editor) {
        editor.addCommand('selectLocalImages', function() {
          var inputF = editor.$(
            '<input type="file" name="thumbnail" accept="image/jpg,image/jpeg,image/png,image/gif" multiple="multiple">'
          );
          var setting = editor.settings.upload;
          setting.scale = setting.scale || [];
          var promises = [];
          var promises2 = [];
          var compress = function(task) {
            if (
              task.file.type.match('image.*') &&
              task.file.type !== 'image/gif' &&
              (setting.compress - 1 !== 0 ||
                setting.scale[0] - 0 !== 0 ||
                setting.upload.scale[1] - 0 !== 0)
            ) {
              var canvas = document.createElement('canvas');
              var img = new Image();
              var ctx = canvas.getContext('2d');
              img.src = URL.createObjectURL(task.file);
              promises.push(
                // eslint-disable-next-line no-undef
                new Promise(function(resolve) {
                  img.onload = function() {
                    var imgW = img.width;
                    var imgH = img.height;
                    var scaleW = setting.scale[0];
                    var scaleH = setting.scale[1];
                    if (scaleW - 0 === 0 && scaleH > 0) {
                      canvas.width = (imgW / imgH) * scaleH;
                      canvas.height = scaleH;
                    } else if (scaleH - 0 === 0 && scaleW > 0) {
                      canvas.width = scaleW;
                      canvas.height = (imgH / imgW) * scaleW;
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
                    canvas.toBlob(
                      function(blob) {
                        resolve(blob);
                      },
                      'image/jpeg',
                      setting.compress * 0.95
                    );
                  };
                }).then(function(blob) {
                  blob.name = task.file.name;
                  task.file = blob;
                })
              );
            }
          };
          var tasks = [];
          var uping = false;
          var upload = function(task) {
            promises2.push(
              // eslint-disable-next-line no-undef
              new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                var url = setting.url;
                // 避免浏览器缓存http请求
                url += (/\?/.test(url) ? '&' : '?') + new Date().getTime();
                xhr.open('POST', url, true);
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    if (
                      (xhr.status === 200 || xhr.status === 201) &&
                      xhr.responseText !== ''
                    ) {
                      task.result = JSON.parse(xhr.responseText);
                      task.isSuccess = true;
                      task.isFinish = true;
                      task.endDate = new Date();
                    } else {
                      editor.notificationManager.open({
                        text: task.file.name + '上传失败',
                        type: 'error'
                      });
                    }
                    resolve(task);
                  }
                };
                var formData = new FormData();
                formData.append('file', task.file);
                if (setting.token) {
                  formData.append('token', setting.token);
                }
                if (setting.param) {
                  for (let key in setting.param) {
                    formData.append(key, setting.param[key]);
                  }
                }
                xhr.send(formData);
              })
            );
          };
          var dom = editor.dom;
          inputF.on('change', function() {
            if (uping === true) return;
            var files = this.files;
            promises.length = 0;
            promises2.length = 0;
            tasks.length = 0;
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              var task = new BaseTask(file);
              compress(task);
              upload(task);
            }
            // eslint-disable-next-line no-undef
            Promise.all(promises)
              .then(function() {
                // eslint-disable-next-line no-undef
                return Promise.all(promises2);
              })
              .then(function(res) {
                editor.focus();
                res.forEach(function(item) {
                  const src = setting.token
                    ? `${setting.view}?key=${item.result.key}&token=${
                      setting.token
                    }`
                    : item.result.data[0];
                  editor.selection.setContent(
                    dom.createHTML('img', {
                      src
                    })
                  );
                });
                editor.targetElm.change && editor.targetElm.change();
                uping = false;
              });
          });
          inputF[0].click();
        });
      }
    };
  });
  define('tinymce.plugins.uploadimage.ui.Buttons', [], function() {
    return {
      register: function(editor) {
        editor.addButton('uploadimage', {
          icon: 'image',
          tooltip: '上传图片',
          cmd: 'selectLocalImages'
        });
        editor.addMenuItem('uploadimage', {
          icon: 'image',
          text: '上传图片',
          context: 'insert',
          cmd: 'selectLocalImages'
        });
      }
    };
  });
  define('tinymce.plugins.uploadimage.Plugin', [
    'tinymce.core.PluginManager',
    'tinymce.plugins.uploadimage.api.Commands',
    'tinymce.plugins.uploadimage.ui.Buttons'
  ], function(PluginManager, Commands, Buttons) {
    PluginManager.add('uploadimage', function(editor) {
      Commands.register(editor);
      Buttons.register(editor);
    });
    return function() {};
  });
  dem('tinymce.plugins.uploadimage.Plugin')();
})();
