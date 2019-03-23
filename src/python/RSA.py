from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

import os


class RSACipher:
    def __init__(self):
        self.status = (False, 0)

    def generate_key(self, passphrase):
        key = RSA.generate(2048)
        pub = key.publickey().exportKey('PEM')
        pri = key.exportKey('PEM')
        return pub.decode(), pri.decode()

    def encrypt(self, cipher_file, key_file, output):
        cf = open(cipher_file, 'rb')
        kf = open(key_file, 'r')
        ef = open(output, 'wb')

        pub_key = kf.read()
        keypub = RSA.importKey(pub_key.encode())

        cipher = PKCS1_OAEP.new(keypub)
        '''
        hashAlgo (hash object) - The hash function to use.
            This can be a module under Crypto.Hash or an existing hash object
            created from any of such modules.
            If not specified, Crypto.Hash.SHA (that is, SHA-1) is used.

        mLen = len(m) // 8
        for OAEP:
            If mLen > k - 2hLen - 2, output "message too long" and stop.
        for PKCS#1 v1.5 compatible padding:
            If mLen > k - 11, output "message too long" and stop.

        OAEP is for encrypt/decrypt file
        PKCS#1 is for digital signature

        PKCS#1 2048 bit key: maximum length = (2048 // 8) – 11 = 245 bytes
        OAEP 2048 bit key:
            hLen = len(SHA1) = 160 bits
            maximum length = (2048 // 8) - 2(160 // 8) - 2 = 134 bytes
        '''
        block_size = 134
        num_block = os.path.getsize(cipher_file) // block_size
        round = 0

        while True:
            # print("{}: Round {} of {}".format(cipher_file, round, num_block))
            round += 1
            a = cf.read(block_size)
            if not a:
                break
            cipher_text = cipher.encrypt(a)
            ef.write(cipher_text)
        cf.close()
        kf.close()
        ef.close()

    def decrypt(self, cipher_file, key_file, output):
        cf = open(cipher_file, 'rb')
        kf = open(key_file, 'r')
        ef = open(output, 'wb')
        pri_key = kf.read()
        keypri = RSA.importKey(pri_key.encode())
        cipher = PKCS1_OAEP.new(keypri)
        block_size = 2048 // 8
        num_block = os.path.getsize(cipher_file) // block_size
        round = 0

        while True:
            # print("{}: Round {} of {}".format(cipher_file, round, num_block))
            round += 1
            a = cf.read(block_size)
            if not a:
                break
            plain_text = cipher.decrypt(a)
            ef.write(plain_text)
        cf.close()
        kf.close()
        ef.close()
