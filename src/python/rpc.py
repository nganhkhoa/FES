import zerorpc
import shutil

from RSA import RSACipher


class RPC(object):
    def __init__(self):
        self.rsa = RSACipher()
        self.rsa.generate_key()

    @zerorpc.stream
    def encrypt_folder(self, algo, folder, keyfile):
        yield "Encrypt folder {} using {}".format(folder, algo)
        archive = shutil.make_archive(folder, 'zip', folder)
        yield "Created zip file of folder"
        self.rsa.encrypt(archive, 'private_key.txt', folder + '_encrypted')
        yield "Encrypted zip file of folder"

    def encrypt_file(self, algo, file):
        return file


s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
print("Server running on port 4242")
s.run()
