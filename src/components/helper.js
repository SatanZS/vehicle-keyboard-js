var def = require('./define.js');

// 纯辅助函数
// Author: 陈哈哈 yoojiachen@gmail.com

/**
 * 构建一个KeyEntity
 * @param {*text} 键位文本
 * @param {*keyCode} 按键码
 * @param {*enabled} 是否启用状态
 */
export function keyOf(text, keyCode, enabled) {
  return {
    text: text, // 键位文字
    keyCode: keyCode === undefined ? def.KEY_TYPES.GENERAL : keyCode, // 键位功能类型代码，默认：普通键位
    enabled: enabled === undefined ? true : enabled, // 是否可用，默认：启用
    isFunKey: keyCode === undefined ? false : keyCode !== def.KEY_TYPES.GENERAL // 是否为功能键
  };
}

/**
 * 修改和创建一个新的KeyEntity，指定是否启用状态。
 * @param {*entity} 原KeyEntity
 * @param {*enabled} 是否启用状态
 */
export function keyOfEnabled(entity, enabled) {
  return keyOf(
    entity.text,
    entity.keyCode,
    enabled // 修改
  );
}

/** 将字符串转换成KeyEntity */
export function keysOf(str) {
  var output = new Array();
  for (var i = 0; i < str.length; i++) {
    output.push(keyOf(str[i]));
  }
  return output;
}

/** 修改和创建一个新的KeyEntity，指定功能键盘参数 */
export function keyOfCode(entity, text, keyCode) {
  return keyOf(
    text,
    keyCode, // 修改
    entity.enabled
  );
}

export function contains(src, item) {
  return src.indexOf(item) >= 0;
}

function isProvince(str) {
  return contains(def.S_CIVIL_PVS, str);
}
export { isProvince };
/** 探测车牌号码的模式 */
export function detectNumberTypeOf(presetNumber) {
  if (presetNumber.length === 0) {
    return def.NUM_TYPES.AUTO_DETECT;
  }
  var first = presetNumber.charAt(0);
  if (contains(def.S_PLA2012_PVS, first)) {
    return def.NUM_TYPES.PLA2012;
  } else if (def.C_SHI2007 === first) {
    return def.NUM_TYPES.SHI2007;
  } else if (def.C_MIN === first) {
    return def.NUM_TYPES.AVIATION;
  } else if (contains(def.S_123, first)) {
    return def.NUM_TYPES.SHI2017;
  } else if (def.C_W === first) {
    if (presetNumber.length >= 3 && isProvince(presetNumber.charAt(2))) {
      return def.NUM_TYPES.WJ2012;
    }
    return def.NUM_TYPES.WJ2007;
  } else if (isProvince(first)) {
    if (presetNumber.length === 8) {
      // 新能源车牌：
      if (
        /\W[A-Z][0-9ABCDEFGHJK][0-9A-Z]\d{3}[0-9ABCDEFGHJK]/.test(presetNumber)
      ) {
        return def.NUM_TYPES.NEW_ENERGY;
      }
      return def.NUM_TYPES.UNKNOWN;
    }
    return def.NUM_TYPES.CIVIL;
  }
  return def.NUM_TYPES.UNKNOWN;
}
