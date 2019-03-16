from Crypto.Cipher import AES
import hashlib

class AES_cipher:
	def __init__(self):
		self.iv = 'This is an IV456'

	def encrypt(self, file_path, key_str):
		file = open(file_path, 'rb')
		out_file = open('encrypted', 'wb')
		key = hashlib.sha256(key_str.encode()).digest()
		cipher = AES.new(key, AES.MODE_CFB, self.iv)
		while True:
			a = file.read(256)
			if not a:
				break
			cipher_text = cipher.encrypt(a)
			out_file.write(cipher_text)
		file.close()
		out_file.close()

	def decrypt(self, file_path, key_str):
		file = open(file_path, 'rb')
		out_file = open('decrypted', 'wb')
		key = hashlib.sha256(key_str.encode()).digest()
		cipher = AES.new(key, AES.MODE_CFB, self.iv)
		while True:
			a = file.read(256)
			if not a:
				break
			cipher_text = cipher.decrypt(a)
			out_file.write(cipher_text)
		file.close()
		out_file.close()

aes = AES_cipher()
aes.encrypt('ca.jpg','namno')
aes.decrypt('encrypted','namno')
