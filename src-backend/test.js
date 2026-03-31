import assert from 'node:assert/strict';
import { test } from 'node:test';

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