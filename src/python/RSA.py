from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 as pkcs1


class RSACipher:
    def __init__(self):
        self.status = (False, 0)

    def generate_key(self):
        key = RSA.generate(2048)
        pub = key.publickey().exportKey('PEM')
        pri = key.exportKey('PEM')
        public_file = open('public_key.txt', 'w')
        private_file = open('private_key.txt', 'w')
        public_file.write(pub.decode())
        private_file.write(pri.decode())
        public_file.close()
        private_file.close()

    def encrypt(self, cipher_file, key_file, output):
        cf = open(cipher_file, 'rb')
        kf = open(key_file, 'r')
        ef = open(output, 'wb')

        pub_key = kf.read()
        keypub = RSA.importKey(pub_key.encode())

        cipher = pkcs1.new(keypub)
        '''
    mLen = len(m) // 8
    for OAEP:
        If mLen > k - 2hLen - 2, output "message too long" and stop.
    for PKCS#1 v1.5 compatible padding:
        If mLen > k - 11, output "message too long" and stop.

    for a 2048 bit key the maximum length is (2048 // 256) – 11 = 245 bytes
    '''
        block_size = 245

        while True:
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
        cipher = pkcs1.new(keypri)
        block_size = 245

        while True:
            a = cf.read(block_size)
            if not a:
                break
            plain_text = cipher.decrypt(a, 'nam')
            ef.write(plain_text.decode())
        cf.close()
        kf.close()
        ef.close()
        print('done')
