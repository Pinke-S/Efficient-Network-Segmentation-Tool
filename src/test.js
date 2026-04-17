import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPromise } from 'node:util/types';

import { ipAddress } from 'p2nsa';



// test("name", ()=>{
// Arrange
// Act
// Assert
// })


test("vaild IP", () => {

  // Arrange
  let ip = new ipAddress();

  // Act & Assert
  assert.doesNotThrow(() => { ip.ipAddressFromString("192.168.1.1/24") });
});

test("Character in IP", () => {

  // Arrange
  let ip = new ipAddress();

  // Act & Assert
  assert.throws(() => { ip.ipAddressFromString("192.168.abc.1/24") }, "Invalid IP passed");
});

test("invalid IP", () => {

  // Arrange
  let ip = new ipAddress();

  // Act & Assert
  assert.throws(() => { ip.ipAddressFromString("192.168.800.1/24") }, "Invalid IP passed");
});

test("Invalid prefix", () => {

  // Arrange
  let ip = new ipAddress();

  // Act & Assert
  assert.throws(() => { ip.ipAddressFromString("192.168.abc.1/999") }, "Invalid IP passed");
});

test("Character in Prefix", () => {

  // Arrange
  let ip = new ipAddress();

  // Act & Assert
  assert.throws(() => { ip.ipAddressFromString("192.168.abc.1/rt") }, "Invalid IP passed");
});

test("IP to string", () => {

  // Arrange
  const str = "192.168.1.1/24";
  let ip = new ipAddress();

  // act
  ip.ipAddressFromString(str);

  // Assert
  assert.equal(ip.ipAddressToString(), str);
});

test("Network IP 01", () => {

  // Arrange
  const str = "192.168.1.55/22";
  const expected = "192.168.0.0/22";
  let ip = new ipAddress();

  // act
  ip.ipAddressFromString(str);
  let networkAddress = ip.getNetworkAddress();

  // Assert
  assert.equal(networkAddress, expected);
});

test("Network IP 02", () => {

  // Arrange
  const str = "192.168.1.55/16";
  const expected = "192.168.0.0/16";
  let ip = new ipAddress();

  // act
  ip.ipAddressFromString(str);
  let networkAddress = ip.getNetworkAddress();

  // Assert
  assert.equal(networkAddress, expected);
});

test("Network IP 03", () => {

  // Arrange
  const str = "192.168.1.55/20";
  const expected = "192.168.0.0/20";
  let ip = new ipAddress();

  // act
  ip.ipAddressFromString(str);
  let networkAddress = ip.getNetworkAddress();

  // Assert
  assert.equal(networkAddress, expected);
});

test("Broadcast IP 01", () => {

  // Arrange
  const str = "192.168.1.55/22";
  const expected = "192.168.3.255/22";
  let ip = new ipAddress();

  // act
  ip.ipAddressFromString(str);
  let broadcastAddress = ip.getBroadcastAddress();

  // Assert
  assert.equal(broadcastAddress, expected);
});

test("Broadcast IP 02", () => {

  // Arrange
  const str = "192.168.1.55/16";
  const expected = "192.168.255.255/16";
  let ip = new ipAddress();

  // act
  ip.ipAddressFromString(str);
  let broadcastAddress = ip.getBroadcastAddress();

  // Assert
  assert.equal(broadcastAddress, expected);
});

test("Broadcast IP 03", () => {

  // Arrange
  const str = "192.168.1.55/20";
  const expected = "192.168.15.255/20";
  let ip = new ipAddress();

  // act
  ip.ipAddressFromString(str);
  let broadcastAddress = ip.getBroadcastAddress();

  // Assert
  assert.equal(broadcastAddress, expected);
});

test("Sort subnets by prefix", () => {

  // Arrange
  let isp = new ipAddress();
  let ips = [new ipAddress(), new ipAddress(), new ipAddress(), new ipAddress()];
  const sortedPrefix = [25, 26, 27, 28];

  // act
  isp.ipAddressFromArray([192, 168, 1, 1], 20);
  ips[0].ipAddressFromArray([192, 168, 1, 1], 27);
  ips[1].ipAddressFromArray([192, 168, 1, 1], 25);
  ips[2].ipAddressFromArray([192, 168, 1, 1], 26);
  ips[3].ipAddressFromArray([192, 168, 1, 1], 28);

  isp.addSubnets(ips);


  isp.sortSubnets();


  // Assert
  let success = true;

  for (let i = 0; i < ips.length; i++) {
    if (isp.subnets[i].prefix !== sortedPrefix[i])
      success = false;
  }

  assert.equal(success, true);
});