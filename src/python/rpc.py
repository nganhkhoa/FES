import zerorpc
import shutil
import os

from RSA import RSACipher


class RPC(object):
    def generate_key(algo):
        if algo == 'RSA':
            rsa = RSACipher()
            pub, priv = rsa.generate_key()
            return [pub, priv]
        elif algo == 'AES':
            return ['BLA']
        else:
            print("Not supported algorithm")
            return "Unsupported algorithm"

    def encrypt(self, algo, file, keyfile):
        if (os.path.isfile(file)):
            self.rsa.encrypt(file, 'public_key.txt', file + '_encrypted')
            print("Encrypted file")
            return "Encrypted file"
        elif (os.path.isdir(file)):
            folder = file
            print("Encrypt folder {} using {}".format(folder, algo))
            archive = shutil.make_archive(folder, 'zip', folder)
            print("Created zip file of folder")
            self.rsa.encrypt(archive, 'private_key.txt', folder + '_encrypted')
            print("Encrypted zip file of folder")
            return "Encrypted zip file of folder"
        else:
            return "File is not found"

    def decrypt(self, algo, file, keyfile):
        if (os.path.isfile(file)):
            self.rsa.decrypt(file, 'private_key.txt', file + '_decrypted')
            print("Decrypted file")
            return "Decrypted file"
        else:
            return "File is not found"


s = zerorpc.Server(RPC(), pool_size=5)
s.bind("tcp://0.0.0.0:4242")
print("Server running on port 4242")
s.run()
