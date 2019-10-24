const myDB = {
  name: "local",
  version: 1,
  db: null
};
const cacheName = "cache";
function openDB(name, version) {
  var version = version || 1;
  var request = window.indexedDB.open(name, version);
  request.onerror = function(e) {
    console.log(e.currentTarget.error.message);
  };
  request.onsuccess = function(e) {
    myDB.db = e.target.result;
  };
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains(cacheName)) {
      db.createObjectStore(cacheName, { keyPath: "url" });
    }
    console.log("DB version changed to " + version);
  };
}
function add2Cache(item) {
  return new Promise((resolve, reject) => {
    var request = myDB.db.transaction(cacheName, "readwrite");
    var store = request.objectStore(cacheName);

    store.add(item);
    request.onsuccess = function(event) {
      console.log("数据写入成功");
      resolve();
    };

    request.onerror = function(event) {
      console.log("数据写入失败");
      reject();
    };
  });
}

function getCacheItem(url) {
  return new Promise((resolve, reject) => {
    var transaction = myDB.db.transaction(cacheName, "readwrite");
    var store = transaction.objectStore(cacheName);
    var request = store.get(url);
    request.onsuccess = function(e) {
      var item = e.target.result;
      console.log(item);
      resolve(item);
    };
    request.onerror = function(event) {
      console.log("事务失败");
      reject(event);
    };
  });
}
function readAll() {
  var objectStore = myDB.db.transaction(cacheName).objectStore(cacheName);

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if (cursor) {
      console.log(cursor);
      cursor.continue();
    } else {
      console.log("没有更多数据了！");
    }
  };
}

function update2Cache(item) {
  return new Promise((resolve, reject) => {
    var request = myDB.db
      .transaction(cacheName, "readwrite")
      .objectStore(cacheName)
      .put(item);

    request.onsuccess = function(event) {
      console.log("数据更新成功");
      resolve();
    };

    request.onerror = function(event) {
      console.log("数据更新失败");
      reject();
    };
  });
}

function remove(url) {
  return new Promise((resolve, reject) => {
    var request = myDB.db
      .transaction(cacheName, "readwrite")
      .objectStore(cacheName)
      .delete(url);

    request.onsuccess = function(event) {
      console.log("数据删除成功");
      resolve();
    };
    request.onerror = function(event) {
      console.log("数据更新失败");
      reject();
    };
  });
}

openDB(myDB.name, myDB.version);