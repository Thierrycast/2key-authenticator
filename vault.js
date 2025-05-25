const SALT_STORE = "meta";
const VAULT_STORE = "chaves";

export async function getOrCreateSalt(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SALT_STORE, "readwrite");
    const store = tx.objectStore(SALT_STORE);
    const req = store.get("salt");

    req.onsuccess = () => {
      if (req.result) {
        resolve(req.result.value);
      } else {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        store.put({ id: "salt", value: salt });
        resolve(salt);
      }
    };

    req.onerror = () => reject(req.error);
  });
}

export async function derivarChave(senha, salt) {
  const encoder = new TextEncoder();
  const chaveBase = await crypto.subtle.importKey(
    "raw",
    encoder.encode(senha),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256"
    },
    chaveBase,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function criptografarSegredo(chaveCrypto, segredo) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const dados = encoder.encode(segredo);

  const cifrado = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    chaveCrypto,
    dados
  );

  return { cifrado: new Uint8Array(cifrado), iv };
}

export async function descriptografarSegredo(chaveCrypto, cifrado, iv) {
  const decifrado = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    chaveCrypto,
    cifrado
  );

  return new TextDecoder().decode(decifrado);
}
