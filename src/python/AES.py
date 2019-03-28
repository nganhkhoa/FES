from Crypto.Cipher import AES

import os
import hashlib
import gevent


class AESCipher:
    def __init__(self):
        self.iv = 'This is an IV456'

    def generate_key(self, key):
        return [hashlib.sha256(key.encode()).hexdigest()]

    def encrypt(self, file_path, key, output):
        file = open(file_path, 'rb')
        out_file = open(output, 'wb')
        if os.path.isdir(key):
            raise NameError('Key can not a folder')
        elif os.path.isfile(key):
            _key = bytes.fromhex(open(key, 'r').read())
        else:
            _key = hashlib.sha256(key.encode()).digest()

        num_block = os.path.getsize(file_path) // 128
        round = 0

        cipher = AES.new(_key, AES.MODE_CFB, self.iv)
        while True:
            a = file.read(128)
            if not a:
                break
            cipher_text = cipher.encrypt(a)
            out_file.write(cipher_text)
            yield "{}/{}".format(round, num_block)
            round += 1

        file.close()
        out_file.close()

    def decrypt(self, file_path, key, output):
        file = open(file_path, 'rb')
        out_file = open(output, 'wb')
        if os.path.isdir(key):
            raise NameError('Key can not a folder')
        elif os.path.isfile(key):
            _key = bytes.fromhex(open(key, 'r').read())
        else:
            _key = hashlib.sha256(key.encode()).digest()

        num_block = os.path.getsize(file_path) // 128
        round = 0

        cipher = AES.new(_key, AES.MODE_CFB, self.iv)
        while True:
            a = file.read(128)
            if not a:
                break
            cipher_text = cipher.decrypt(a)
            out_file.write(cipher_text)
            yield "{}/{}".format(round, num_block)
            round += 1

        file.close()
        out_file.close()
