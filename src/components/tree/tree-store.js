const pinyin = require('chinese-to-pinyin')
export default class TreeStore {
  constructor (options) {
    for (const option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option]
      }
    }
    this.datas = new Map()
    const _traverseNodes = (root) => {
      for (const node of root) {
        this.datas.set(node.id, node)
        if (node.children && node.children.length > 0) _traverseNodes(node.children)
      }
    }
    _traverseNodes(this.root)
  }

  changeCheckStatus (node) {
    const _traverseUp = (node) => {
      if (node.checked && node.pid) {
        const parent = this.getNode(node.pid)
        parent.checked = this.sameSilibingChecked(node.pid, node.id)
        _traverseUp(parent)
      } else {
        if (!node.checked && node.pid) {
          const upparent = this.getNode(node.pid)
          upparent.checked = false
          if (upparent.pid) {
            _traverseUp(upparent)
          }
        }
      }
    }

    const _traverseDown = (node) => {
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          child.checked = node.checked
          _traverseDown(child)
        }
      }
    }
    _traverseUp(node)
    _traverseDown(node)
  }
  isNullOrEmpty (world) {
    if (world) {
      return world.trim().length === 0
    }
    return true
  }
  filterNodes (keyworld, searchOptions) {
    const _filterNode = (val, node) => {
      if (!val) return true
      if (searchOptions.useEnglish) {
        return node.name.indexOf(val) !== -1
      } else {
        return this.toPinYin(node.name, searchOptions.useInitial).indexOf(this.toPinYin(keyworld.toLowerCase(), searchOptions.useInitial, true)) !== -1
      }
    }

    const _syncNodeStatus = (node) => {
      if (node.pid) {
        const parentNode = this.getNode(node.pid)
        if (node.visible) {
          parentNode.visible = node.visible
          _syncNodeStatus(parentNode)
        }
      }
    }
    const filterFunc = (searchOptions.customFilter && typeof (searchOptions.customFilter) === 'function') ? searchOptions.customFilter : _filterNode
    this.datas.forEach(node => {
      node.visible = filterFunc(keyworld, node)
      node.searched = false
      if (node.visible) {
        if (!this.isNullOrEmpty(keyworld)) {
          node.searched = true
        }
        _syncNodeStatus(node)
      }
    })
  }
  getNode (key) {
    return this.datas.get(key)
  }
  sameSilibingChecked (pid, currentId) {
    const parent = this.datas.get(pid)
    const sbIds = []
    parent.children.forEach(x => {
      if (x.id !== currentId) sbIds.push(x.id)
    })
    for (const id of sbIds) {
      const node = this.getNode(id)
      if (!node.checked) return false
    }
    return true
  }
  toPinYin (keyworld, useInitial) {
    if (/^[a-zA-Z]/.test(keyworld)) {
      return keyworld
    }
    const fullpinyin = pinyin(keyworld, {
      filterChinese: true,
      noTone: true
    })
    if (useInitial) {
      let res = ''
      fullpinyin.split(' ').forEach(w => {
        if (!(/[a-zA-Z]/.test(w))) {
          res += w
        } else {
          res += w.slice(0, 1)
        }
      })
      return res
    } return fullpinyin
  }
}
