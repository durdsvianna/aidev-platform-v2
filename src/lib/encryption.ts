import * as crypto from 'crypto';

/**
 * Encrypts a string using AES encryption
 * @param text - The string to encrypt (e.g., API key)
 * @returns The encrypted string
 */
export function encrypt(text: string): string {
  try {
    // Use environment variable for the encryption key, or fallback to default for development
    const encryptionKey = process.env.ENCRYPTION_KEY || 'development-encryption-key-change-in-production';
    
    // Use a simpler encryption method to avoid issues with long strings
    // AES-128-CBC is suitable for this use case
    const algorithm = 'aes-128-cbc';
    
    // Create a key buffer from the encryption key
    const key = crypto.createHash('sha256')
      .update(String(encryptionKey))
      .digest('base64')
      .substring(0, 16); // 128 bits (16 bytes) for AES-128
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return the IV and encrypted data as a string
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts a string encrypted with the encrypt function
 * @param encryptedText - The encrypted string
 * @returns The decrypted string
 */
export function decrypt(encryptedText: string): string {
  try {
    const encryptionKey = process.env.ENCRYPTION_KEY || 'development-encryption-key-change-in-production';
    const algorithm = 'aes-128-cbc';
    
    // Create a key buffer from the encryption key
    const key = crypto.createHash('sha256')
      .update(String(encryptionKey))
      .digest('base64')
      .substring(0, 16); // 128 bits for AES-128
    
    // Split the encrypted text into IV and data
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // Create decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Utility to check if a string is already encrypted
 * @param text - Text to check
 * @returns Boolean indicating if text appears to be encrypted
 */
export function isEncrypted(text: string): boolean {
  // Simple heuristic - encrypted text has a specific format
  const parts = text.split(':');
  return parts.length === 2 && parts[0].length === 32; // IV should be 16 bytes = 32 hex chars
} 