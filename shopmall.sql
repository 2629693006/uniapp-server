/*
 Navicat Premium Data Transfer

 Source Server         : dev
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : shopmall

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 19/08/2021 17:51:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收货人姓名',
  `mobile` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '联系方式',
  `state` int(0) NOT NULL DEFAULT 0 COMMENT '状态',
  `rece_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '省级市区县地址',
  `details_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细地址',
  `userId` int(0) NOT NULL COMMENT '用户ID',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES (50, '阿健', '15231231231', 0, '辽宁省|本溪市|平山', '测试123123', 37, '2021-08-04 14:55:12');
INSERT INTO `address` VALUES (51, '御坂', '15212312313', 0, '内蒙古自治区|包头市|东河', '测试', 37, '2021-08-04 15:29:26');
INSERT INTO `address` VALUES (52, '阿健', '15766467819', 1, '北京市|丰台区', '测试', 37, '2021-08-11 22:13:33');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `goods_id` int(0) NOT NULL COMMENT '商品ID',
  `goods_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品类型',
  `quantity` int(0) NULL DEFAULT 1 COMMENT '商品数量',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  `userId` int(0) NOT NULL COMMENT '用户ID',
  `state` tinyint(0) NOT NULL DEFAULT 1 COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 131 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cate_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (5, '家电', '2021-7-24');
INSERT INTO `category` VALUES (9, '水果', '2021-04-24 19:04:11');
INSERT INTO `category` VALUES (10, '日常用品', '2021-22-25 14:22:43');
INSERT INTO `category` VALUES (11, '运动', '2021-07-27 21:32:03');
INSERT INTO `category` VALUES (12, '健身', '2021-07-27 21:32:17');
INSERT INTO `category` VALUES (21, '数码', '2021-07-29 13:58:33');

-- ----------------------------
-- Table structure for er_category
-- ----------------------------
DROP TABLE IF EXISTS `er_category`;
CREATE TABLE `er_category`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cate_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `one_id` int(0) NOT NULL COMMENT '一级分类的ID',
  `cate_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '二级分类图片',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of er_category
-- ----------------------------
INSERT INTO `er_category` VALUES (4, '葡萄', 9, '\\upload\\upload_eb864e7a331af14a63801c641816963f.jpg', '2021-07-27 22:18:26');
INSERT INTO `er_category` VALUES (14, '测试分类1', 16, '\\upload\\upload_c1859ec60f0a209813dd7d130e3ca37b.jpg', '2021-07-28 21:21:01');
INSERT INTO `er_category` VALUES (19, '测试123123', 19, '\\upload\\upload_a5e650079856140cfe428ea748159a19.jpg', '2021-07-29 13:11:54');
INSERT INTO `er_category` VALUES (23, '电视', 5, '\\upload\\upload_88162814374dc924df6ed704ee1489c0.jpg', '2021-07-29 17:31:51');
INSERT INTO `er_category` VALUES (26, '牙膏牙刷1', 10, '\\upload\\upload_221a6bdc7e6b21c8b4cf7548d1d1dbb5.jpg', '2021-08-12 21:35:29');
INSERT INTO `er_category` VALUES (27, '电风扇', 5, '\\upload\\upload_f1f32f75a8db7366e5c99253eca425f7.jpg', '2021-08-12 21:36:04');
INSERT INTO `er_category` VALUES (28, '测试', 21, '\\upload\\upload_a2a146efed3645ac91ca761e9155de9a.png', '2021-08-19 17:11:19');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `goods_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '商品名称',
  `goods_price` decimal(10, 0) NOT NULL COMMENT '商品原价格',
  `goods_discount_price` decimal(10, 0) NULL DEFAULT NULL COMMENT '商品打折价',
  `goods_state` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '1' COMMENT '商品状态',
  `goods_number` int(0) NOT NULL COMMENT '商品数量',
  `goods_img_arr` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '商品图片',
  `goods_small_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品封面',
  `goods_origin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品产地',
  `goods_weight` int(0) NULL DEFAULT NULL COMMENT '商品重量',
  `goods_mode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品包装类型',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  `contnt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '商品描述文本',
  `editor_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '商品描述HTML结构',
  `goods_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品类型',
  `goods_keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品关键字',
  `goods_cate_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '商品分类ID',
  `goods_cate_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品分类名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES (41, '海信 VIDAA 43V1F-R 43英寸 全高清 超薄电视 全面屏电视 智慧屏 1G+8G 教育电视 游戏巨幕液晶电视以旧换新', 1999, 1199, '1', 1, '\\upload\\upload_d13c4b6c517a84f11efc9d6f0e0996a7.jpg,\\upload\\upload_9d844da5249728d9127dab9b036bdbc3.jpg', '\\upload\\upload_26c1f2f3e885c56aa2fdc7971d79af3e.jpg', '中国大陆', 1, '箱子', '2021-07-29 17:32:52', '![6cdd9fcf6e0ecea7.jpg](http://127.0.0.1:8989/\\upload\\upload_6162da01637572e507c694730b411adc.jpg)![7.jpg](http://127.0.0.1:8989/\\upload\\upload_b7313643a7f4e4882795074f8c6338bc.jpg)![12.jpg](http://127.0.0.1:8989/\\upload\\upload_1f05017b03b448a7e3961c9b04c65bbd.jpg)', '<p><img src=\"http://127.0.0.1:8989/%5Cupload%5Cupload_6162da01637572e507c694730b411adc.jpg\" alt=\"6cdd9fcf6e0ecea7.jpg\" /><img src=\"http://127.0.0.1:8989/%5Cupload%5Cupload_b7313643a7f4e4882795074f8c6338bc.jpg\" alt=\"7.jpg\" /><img src=\"http://127.0.0.1:8989/%5Cupload%5Cupload_1f05017b03b448a7e3961c9b04c65bbd.jpg\" alt=\"12.jpg\" /></p>\n', '套餐一|套餐二|套餐三|套餐四|套餐五|套餐六|套餐七', '日常测试', '5-23', '测试');
INSERT INTO `goods` VALUES (42, '三星（SAMSUNG）65英寸QX2 超薄全面屏 4K超高清HDR 120Hz 智能补帧QLED量子点HDMI2.1游戏电视QA65QX2AAJXXZ', 3999, 2999, '1', 1, '\\upload\\upload_906db8c4a0e5d7d49c9b013f49d1aee5.jpg,\\upload\\upload_ddae84ace027b10b75f46ddef601d568.jpg,\\upload\\upload_3e9a9f122b8754d538d8fb9f2e67257e.jpg', '\\upload\\upload_117ec60a8785d8c2ebd831aa03c67d10.jpg', '中国大陆', 1, '箱子', '2021-07-29 17:50:51', '![2.jpg](http://127.0.0.1:8989/\\upload\\upload_227adb9370a823e628e53b2129c41f1f.jpg)![7.jpg](http://127.0.0.1:8989/\\upload\\upload_414531a6e21567d4c8b02e88b3b250db.jpg)', '<p><img src=\"http://127.0.0.1:8989/%5Cupload%5Cupload_227adb9370a823e628e53b2129c41f1f.jpg\" alt=\"2.jpg\" /><img src=\"http://127.0.0.1:8989/%5Cupload%5Cupload_414531a6e21567d4c8b02e88b3b250db.jpg\" alt=\"7.jpg\" /></p>\n', '套餐一|套餐二|套餐三', '日常测试', '5-23', '电视');
INSERT INTO `goods` VALUES (43, '美的电风扇落地扇家用轻音立式宿舍7叶省电摇头生活电器夏天大风', 199, 59, '1', 1000, '\\upload\\upload_adad78fff3a2269778cb9ec0ef926ca9.jpg,\\upload\\upload_69063580aef979cfba0999a3d0dd8514.jpg,\\upload\\upload_319d9fdcd5060112eeadb0915b475c6e.jpg,\\upload\\upload_99127af7e8a91343f92d3b297d2a066b.jpg,\\upload\\upload_e2ba7fa6ad937c30f098e8cd77655dcc.jpg', '\\upload\\upload_7ef9015dcf1cb9f9742d227ebef633c2.jpg', '中国大陆', 5, '箱子', '2021-08-12 21:39:27', '测试\n![O1CN01ifviI.jpg](http://127.0.0.1:8989/\\upload\\upload_1e6ce452a3a66fff692682e48c970210.jpg)', '<p>测试<br />\n<img src=\"http://127.0.0.1:8989/%5Cupload%5Cupload_1e6ce452a3a66fff692682e48c970210.jpg\" alt=\"O1CN01ifviI.jpg\" /></p>\n', '黑色|白色', '风扇-落地扇-家电-电器-美的', '5-27', '电风扇');

-- ----------------------------
-- Table structure for order_info
-- ----------------------------
DROP TABLE IF EXISTS `order_info`;
CREATE TABLE `order_info`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `order_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单编号',
  `order_state` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单状态',
  `order_not_shipped_state` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '发货状态',
  `order_pay_state` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '付款状态',
  `userId` int(0) NOT NULL COMMENT '用户ID',
  `address_id` int(0) NOT NULL COMMENT '收货地址ID',
  `price` int(0) NOT NULL COMMENT '商品合计',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  `order_received_state` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0' COMMENT '收货状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 121 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_info
-- ----------------------------
INSERT INTO `order_info` VALUES (113, '1339732507237777', '1', '1', '1', 37, 51, 1199, '2021-08-13 14:30:16', '0');
INSERT INTO `order_info` VALUES (115, '4434577710405796', '1', '1', '1', 37, 51, 1199, '2021-08-13 14:30:33', '0');
INSERT INTO `order_info` VALUES (117, '5473719416297906', '1', '1', '1', 37, 51, 1376, '2021-08-13 14:31:19', '0');
INSERT INTO `order_info` VALUES (118, '8963490092611987', '1', '1', '1', 37, 51, 8514, '2021-08-13 15:54:26', '0');
INSERT INTO `order_info` VALUES (119, '9176003634989195', '1', '0', '1', 37, 51, 2999, '2021-08-19 15:17:33', '0');

-- ----------------------------
-- Table structure for order_item
-- ----------------------------
DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `order_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单编号',
  `goods_id` int(0) NOT NULL COMMENT '商品ID',
  `quantity` int(0) NOT NULL COMMENT '商品数量',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  `goods_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品类型',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 199 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_item
-- ----------------------------
INSERT INTO `order_item` VALUES (179, '1339732507237777', 41, 1, '2021-08-13 14:30:16', '套餐一');
INSERT INTO `order_item` VALUES (181, '4434577710405796', 41, 1, '2021-08-13 14:30:33', '套餐二');
INSERT INTO `order_item` VALUES (183, '5473719416297906', 43, 2, '2021-08-13 14:31:19', '黑色');
INSERT INTO `order_item` VALUES (184, '5473719416297906', 43, 1, '2021-08-13 14:31:19', '白色');
INSERT INTO `order_item` VALUES (185, '5473719416297906', 41, 1, '2021-08-13 14:31:19', '套餐一');
INSERT INTO `order_item` VALUES (186, '8963490092611987', 41, 1, '2021-08-13 15:54:26', '套餐五');
INSERT INTO `order_item` VALUES (187, '8963490092611987', 43, 1, '2021-08-13 15:54:26', '黑色');
INSERT INTO `order_item` VALUES (188, '8963490092611987', 43, 1, '2021-08-13 15:54:26', '白色');
INSERT INTO `order_item` VALUES (189, '8963490092611987', 42, 1, '2021-08-13 15:54:26', '套餐二');
INSERT INTO `order_item` VALUES (190, '8963490092611987', 42, 1, '2021-08-13 15:54:26', '套餐三');
INSERT INTO `order_item` VALUES (191, '8963490092611987', 41, 1, '2021-08-13 15:54:26', '套餐三');
INSERT INTO `order_item` VALUES (192, '9176003634989195', 42, 1, '2021-08-19 15:17:33', '套餐三');

-- ----------------------------
-- Table structure for swi
-- ----------------------------
DROP TABLE IF EXISTS `swi`;
CREATE TABLE `swi`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `swi_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '轮播图地址',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  `goods_id` int(0) NOT NULL COMMENT '关联的商品ID',
  `goods_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '关联的商品标题',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of swi
-- ----------------------------
INSERT INTO `swi` VALUES (17, '\\upload\\upload_9505914706257e35df7076778e7f7f93.jpg', '2021-08-14 16:59:05', 42, '三星（SAMSUNG）65英寸QX2 超薄全面屏 4K超高清HDR 120Hz 智能补帧QLED量子点HDMI2.1游戏电视QA65QX2AAJXXZ');
INSERT INTO `swi` VALUES (18, '\\upload\\upload_04481f609811e819952168264c6fcee8.jpg', '2021-08-14 17:11:43', 43, '美的电风扇落地扇家用轻音立式宿舍7叶省电摇头生活电器夏天大风');
INSERT INTO `swi` VALUES (19, '\\upload\\upload_1fd34fcb899fb050993c6e8424076153.jpg', '2021-08-19 17:19:19', 42, '三星（SAMSUNG）65英寸QX2 超薄全面屏 4K超高清HDR 120Hz 智能补帧QLED量子点HDMI2.1游戏电视QA65QX2AAJXXZ');
INSERT INTO `swi` VALUES (20, '\\upload\\upload_bf8deb38cb9cfaf634dbfec91e057df7.jpg', '2021-08-19 17:19:37', 42, '三星（SAMSUNG）65英寸QX2 超薄全面屏 4K超高清HDR 120Hz 智能补帧QLED量子点HDMI2.1游戏电视QA65QX2AAJXXZ');
INSERT INTO `swi` VALUES (21, '\\upload\\upload_08836e6c60b7d0b62f6157cfa11e00c7.jpg', '2021-08-19 17:26:12', 41, '海信 VIDAA 43V1F-R 43英寸 全高清 超薄电视 全面屏电视 智慧屏 1G+8G 教育电视 游戏巨幕液晶电视以旧换新');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名不能为空',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码不能为空',
  `state` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1' COMMENT '用户状态',
  `account` decimal(10, 0) NOT NULL DEFAULT 0 COMMENT '账户',
  `control` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0' COMMENT '用户控制',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 40 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (18, '空太', '$2b$10$idqYV7LXnFj5TGErw3HBJOyxW9ltcJsAfPVekuI8otK9tLL5QYs1y', '0', 0, '0', '2021-07-21');
INSERT INTO `user` VALUES (37, '黑子', '$2b$10$36N03aGQ48zsBYBeoB6ZVOYw/ACG4I/swn4L8M6GkU9tPHo.0lvCm', '1', 0, '0', '2021-07-25 14:42:36');
INSERT INTO `user` VALUES (38, '测试', '$2b$10$bGcwB3N6bkOyicyV89kCxO6mhB6JHEmm6K9NFYCPKKxRDo4gtid0m', '1', 0, '0', '2021-08-19 16:29:23');
INSERT INTO `user` VALUES (39, '草帽小子', '$2b$10$MouMioNHnTRKjkMeBiH3keOFHHH.XrjWpm3W4to3RlRZbjpRjfp.6', '1', 0, '0', '2021-08-19 16:49:48');

SET FOREIGN_KEY_CHECKS = 1;
