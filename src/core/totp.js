function base32ToBytes(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  base32 = base32.replace(/=+$/, "").toUpperCase();

  for (let char of base32) {
    const val = alphabet.indexOf(char);
    if (val === -1) throw new Error("Caractere inválido no base32");
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return new Uint8Array(bytes);
}

export async function gerarTOTP(secretBase32) {
  const keyBytes = base32ToBytes(secretBase32);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const counter = Math.floor(Date.now() / 1000 / 30);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(0, 0);     
  view.setUint32(4, counter);

  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, buffer));

  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];

  const code = binCode % 1_000_000;
  return code.toString().padStart(6, "0");
}
