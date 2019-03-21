import zerorpc
import shutil
import os

from RSA import RSACipher


def algorithmFactory(algo):
    if algo == 'RSA':
        return RSACipher()
    else:
        return None


class RPC(object):
    def generate_key(algo):
        algoInstance = algorithmFactory(algo)
        if (algoInstance is None):
            return "Unsupported algorithm"
        return algoInstance.generate_key()

    def encrypt(self, algo, file, keyfile):
        algoInstance = algorithmFactory(algo)
        if (algoInstance is None):
            return "Not a valid algorithm"
        if (os.path.isfile(file)):
            algoInstance.encrypt(file, 'public_key.txt', file + '_encrypted')
            print("Encrypted file")
            return "Encrypted file"
        elif (os.path.isdir(file)):
            folder = file
            print("Encrypt folder {} using {}".format(folder, algo))
            archive = shutil.make_archive(folder, 'zip', folder)
            print("Created zip file of folder")
            algoInstance.encrypt(
                archive,
                'private_key.txt',
                folder + '_encrypted')
            print("Encrypted zip file of folder")
            return "Encrypted zip file of folder"
        else:
            return "File is not found"

    def decrypt(self, algo, file, keyfile):
        algoInstance = algorithmFactory(algo)
        if (algoInstance is None):
            return "Not a valid algorithm"
        if (os.path.isfile(file)):
            algoInstance.decrypt(file, 'private_key.txt', file + '_decrypted')
            print("Decrypted file")
            return "Decrypted file"
        else:
            return "File is not found"


s = zerorpc.Server(RPC(), pool_size=5)
s.bind("tcp://0.0.0.0:4242")
print("Server running on port 4242")
s.run()
