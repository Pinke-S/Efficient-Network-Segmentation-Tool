import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPromise } from 'node:util/types';

// import { ipAddress, allocateSubnets } from 'p2nsa';
import { ipAddress } from 'p2nsa/ipAddresse'
import { allocateSubnets } from 'p2nsa/allocation'





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


test("allocation 01", () => {
  // Arange
  let ip = new ipAddress();
  ip.ipAddressFromString("192.168.10.0/24");
  let subnets = [new ipAddress(), new ipAddress(), new ipAddress(), new ipAddress()]

  subnets[0].prefix = 26;
  subnets[1].prefix = 26;
  subnets[2].prefix = 26;
  subnets[3].prefix = 26;

  ip.addSubnets(subnets);
  ip.sortSubnets();

  // Act & assert
  let networks;
  assert.throws(() => { networks = allocateSubnets(ip) });
})

test("allocation 02", () => {
  // Arange
  let ip = new ipAddress();
  ip.ipAddressFromString("192.168.1.0/24");
  let subnets = [new ipAddress(), new ipAddress(), new ipAddress()]

  subnets[0].prefix = 25;
  subnets[1].prefix = 26;
  subnets[2].prefix = 26;

  ip.addSubnets(subnets);
  ip.sortSubnets();

  // Act & assert
  let networks;
  assert.doesNotThrow(() => { networks = allocateSubnets(ip) });

  // * output
  //   192.168.1.128 / 26
  //   192.168.1.192 / 26
  //   192.168.1.0 / 25
})




/*
  * input
192.168.1.0 / 24
  / 26
  / 25
  / 26

  * output
192.168.1.128 / 26
192.168.1.192 / 26
192.168.1.0 / 25



  * input
192.168.10.0 / 23
  / 24
  / 25
  / 25

  * output
192.168.11.0 / 25
192.168.11.128 / 25
192.168.10.0 / 24



  * input
10.0.0.0 / 24
  / 26
  / 26
  / 26
  / 26

  * output
10.0.0.0 / 26
10.0.0.64 / 26
10.0.0.128 / 26
10.0.0.192 / 26



  * input
172.16.0.0 / 24
  / 25
  / 27
  / 27
  / 26


  * output
172.16.0.192 / 27
172.16.0.224 / 27
172.16.0.128 / 26
172.16.0.0 / 25

!Down is cases that should fail
  * input
192.168.1.0 / 25
  / 26
  / 26
  / 26

  * output
ERROR



  * input
192.168.1.0 / 24
  / 26
  / 25
  / 25

  * output
ERROR



  * input
192.168.1.0 / 24
  / 23
  / 26

  * output
ERROR



  * input
192.168.1.0 / 24
  / 25
  / 26
  / 27
  / 27

  * output
ERROR



  * input
10.0.0.0 / 24
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28
  / 28


  * output
ERROR
  */